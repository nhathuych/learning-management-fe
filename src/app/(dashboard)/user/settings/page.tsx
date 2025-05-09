import SharedNotificationSettings from '@/components/users/SharedNotificationSettings'

const UserSettingPage = () => {
  return (
    <div className='w-3/5'>
      <SharedNotificationSettings
        title='User Settings'
        subtitle='Manage your user notification settings'
      />
    </div>
  )
}

export default UserSettingPage
