import { observer } from "mobx-react-lite";
import { useState } from "react";
import { Segment, Item, Header, Button, Icon, Tab, Grid } from "semantic-ui-react";
import { Profile } from "../../app/models/profile";
import { useStore } from "../../app/stores/store";
import ProfileEditForm from './ProfileEditForm';

interface Props {
    profile: Profile;
}

export default observer(function ProfileAbout({ profile }: Props) {
    const { profileStore, activityStore } = useStore();
    const [editMode, setEditMode] = useState(false);

    function handleProfileUpdate(profile: Profile) {
        profileStore.setProfile(profile).then(() => setEditMode(false)).then(() => activityStore.loadActivities());
    }

    return (
        <Tab.Pane>
            <Grid>
                <Grid.Column width={16}>
                    <Header floated='left' icon='user' content={`About ${profile.displayName}`} />
                    {profileStore.isCurrentUser && (
                        <Button floated='right' basic
                            content={editMode ? 'Cancel' : 'Edit Profile'}
                            onClick={() => setEditMode(!editMode)}
                        />)
                    }
                </Grid.Column>
                <Grid.Column width={16}>
                    {editMode ? (
                        <ProfileEditForm handleProfileUpdate={handleProfileUpdate} profile={profile} />
                    ) : (
                        <span style={{ whiteSpace: 'pre-wrap' }}>{profile.bio}</span>
                    )}
                </Grid.Column>
            </Grid>

        </Tab.Pane>
    )
})