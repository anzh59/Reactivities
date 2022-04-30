import { Form, Formik } from 'formik'
import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { Button } from 'semantic-ui-react';
import * as Yup from 'yup';
import MyTextArea from '../../app/common/form/MyTextArea';
import MyTextInput from '../../app/common/form/MyTextInput';
import { ActivityFormValues } from '../../app/models/activity';
import { Profile } from '../../app/models/profile';
import { useStore } from '../../app/stores/store';


interface Props {
    profile: Profile;
    handleProfileUpdate: (profile: Profile) => void;
}

export default observer(function ProfileEditForm({ profile, handleProfileUpdate }: Props) {
    const { profileStore } = useStore();

    const validationSchema = Yup.object({
        displayName: Yup.string().required('displayName is a required field')
    })

    return (
        <Formik
            validationSchema={validationSchema}
            enableReinitialize
            initialValues={profile}
            onSubmit={handleProfileUpdate} >
            {({ handleSubmit, isValid, isSubmitting, dirty }) => (
                <Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>
                    <MyTextInput name='displayName' placeholder='DisplayName' />
                    <MyTextArea rows={3} placeholder='Bio' name='bio' />
                    <Button
                        disabled={isSubmitting || !dirty || !isValid}
                        loading={isSubmitting} floated='right'
                        positive type='submit' content='Update Profile' />
                </Form>
            )}
        </Formik>
    )
})