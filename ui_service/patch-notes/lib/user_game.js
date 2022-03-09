async function getFirstServiceId (user, email) {
    const formData = {
      name: user,
      email: email
    }
    try {
      const res = await fetch('/api/email', {
          method: 'POST', 
          headers: {'Content-Type': 'application/json'}, 
          body: JSON.stringify(formData)
        })
      if (res.status === 200) {
        return true
      }
    } catch (error) {
      console.error(error)
      return false
    }
  }

export async function addUpdateUserGameNotifications(notificationParameters){
    let mail;
    notificationParameters.mailChange === "on" ? mail = 1 : mail = 0
    // First, we check to see if this is the first time a user has turned on notifications
    // If it is, we need to make a call to Galactus to get a new service ID for them and update their user data in our DB
    if (mail && notificationParameters.service_id == null){
      const response = await getFirstServiceId(notificationParameters.user, notificationParameters.email)
      if (!response) {
        console.log('There was an error getting and setting the service id')
        return
      }
    }
    // in either case, we need to update our DB relationship for this user/game to reflect the new notification status
    try {
      const res = await fetch('/api/update-email', 
      { method: 'POST', headers: {'Content-Type': 'application/json'}, 
      body: JSON.stringify({user: notificationParameters.user, game: notificationParameters.gameToNotify, mail: mail})
        })
      if (res.status == 200) {
        return true
      }
    } catch (error) {
        console.error(error)
        return false
    }
}