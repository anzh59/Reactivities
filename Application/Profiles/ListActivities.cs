using Application.Core;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Profiles
{
    public class ListActivities
    {
        public class Query : IRequest<Result<List<UserActivityDto>>>
        {
            public string Predicate { get; set; }
            public string Username { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<List<UserActivityDto>>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor)
            {
                _mapper = mapper;
                _userAccessor = userAccessor;
                _context = context;
            }

            public async Task<Result<List<UserActivityDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var query = _context.Activities
                    .Where(a => a.Attendees.Any(x => x.AppUser.UserName == request.Username))
                    .OrderBy(d => d.Date)
                    .ProjectTo<UserActivityDto>(_mapper.ConfigurationProvider)
                    .AsQueryable();

                switch (request.Predicate)
                {
                    case "past":
                        query = query.Where(x => x.Date < DateTime.UtcNow);
                        break;

                    case "hosting":
                        query = query.Where(x => x.HostUsername == request.Username);
                        break;

                    case "all":
                        break;

                    default:
                        query = query.Where(x => x.Date >= DateTime.UtcNow);
                        break;
                }

                var activities = await query.ToListAsync();

                return Result<List<UserActivityDto>>.Success(activities);
            }
        }
    }
}
