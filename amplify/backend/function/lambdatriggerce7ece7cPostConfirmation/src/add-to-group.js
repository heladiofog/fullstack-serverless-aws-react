const {
  CognitoIdentityProviderClient,
  AdminAddUserToGroupCommand,
  GetGroupCommand,
  CreateGroupCommand,
} = require('@aws-sdk/client-cognito-identity-provider');

const cognitoIdentityServiceProvider = new CognitoIdentityProviderClient({
  apiVersion: '2016-04-18'
});

exports.handler = async (event) => {
  let isAdmin = false;
  const adminEmails = ['heladiofog@gmail.com'];
  // If the user is one of admins, set isAdmin variable to true
  if (adminEmails.indexOf(event.request.userAttributes.email) !== -1) {
    isAdmin = true;
  }

  const groupParams = {
    GroupName: process.env.GROUP || 'Admin',
    UserPoolId: event.userPoolId,
  };

  const addUserParams = {
    GroupName: process.env.GROUP || 'Admin',
    UserPoolId: event.userPoolId,
    Username: event.userName,
  };

  if (isAdmin) {
    groupParams.GroupName = 'Admin';
    addUserParams.GroupName = 'Admin';
    // First check to see if the group exists, and if not, create the group
    try {
      // 2020 way, these doesn't work anymore...
      // await cognitoIdentityServiceProvider.getGroup(groupParams).promise();
      await cognitoIdentityServiceProvider.send(new GetGroupCommand(groupParams));
    } catch (error) {
      console.log("Error getting the group, it probably doesn't exist. ", error);
      // 2020 way, these doesn't work anymore...
      // await cognitoIdentityServiceProvider.createGroup(groupParams).promise();
      await cognitoIdentityServiceProvider.send(new CreateGroupCommand(groupParams));
    }
    // If the user is administrator, place them in the Admin group
    try {
      // 2020 way, these doesn't work anymore...
      // await cognitoIdentityServiceProvider.adminAddUserToGroup(userParams).promise();
      await cognitoIdentityServiceProvider.send(new AdminAddUserToGroupCommand(addUserParams));

      return event;

      // callback(null, event);
    } catch (error) {
      console.log("Error adding the user into admin group.", error);
      // callback(error);
      return event;
    }
  } else {
    // Id the user is in neither group, proceed with no action
    console.log("User is in neither group.");
    // callback(null, event);
    return event;
  }
};

// /**
//  * @type {import('@types/aws-lambda').PostConfirmationTriggerHandler}
//  */
// exports.handler = async (event) => {
//   const groupParams = {
//     GroupName: process.env.GROUP,
//     UserPoolId: event.userPoolId,
//   };
//   const addUserParams = {
//     GroupName: process.env.GROUP,
//     UserPoolId: event.userPoolId,
//     Username: event.userName,
//   };
//   /**
//    * Check if the group exists; if it doesn't, create it.
//    */
//   try {
//     await cognitoIdentityServiceProvider.send(new GetGroupCommand(groupParams));
//   } catch (e) {
//     await cognitoIdentityServiceProvider.send(new CreateGroupCommand(groupParams));
//   }
//   /**
//    * Then, add the user to the group.
//    */
//   await cognitoIdentityServiceProvider.send(new AdminAddUserToGroupCommand(addUserParams));

//   return event;
// };
