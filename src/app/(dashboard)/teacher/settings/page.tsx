import SharedNotificationSettings from '@/components/users/SharedNotificationSettings'

const TeacherSettingPage = () => {
  return (
    <div className='w-3/5'>
      <SharedNotificationSettings
        title='Teacher Settings'
        subtitle='Manage your user notification settings'
      />
    </div>
  )
}

export default TeacherSettingPage
