//Internal AtlasBot functions 
// (No-calls from discord reader)


var userList = [];

function AddUser(name, id, forumUrl, userGroups){
	var uniqueId = true, 
		uniqueUrl = true;
	for(var i = 0, len = userList.length; i < len; i++){
		if(userList[i].id = id){
			uniqueId = false;
		}
		if(userList[i].forumUrl = forumUrl){
			uniqueUrl = false;
		}
	}

	if(uniqueId && uniqueUrl){

		userList[len] = {
		 created : Date.time('dd/mm/yy'), 
		 modified : Date.time('dd/mm/yy'),
		 name : name,
		 id : id, 
		 forumUrl : forumUrl,
		 userGroups : userGroup 
		 }
	
	}else{

		//Call error

	}
}


function modifyUser(name, id, forumUrl, userGroups){
	var uniqueId = true, 
		uniqueUrl = true;
	for(var i = 0, len = userList.length; i < len; i++){
		if(userList[i].id = id){
			uniqueId = false;
		}
		if(userList[i].forumUrl = forumUrl){
			uniqueUrl = false;
		}
	}

	if(uniqueId && uniqueUrl){

		userList[len] = {
		 created : Date.time('dd/mm/yy'), 
		 modified : Date.time('dd/mm/yy'),
		 name : name,
		 id : id, 
		 forumUrl : forumUrl,
		 userGroups : userGroup 
		 }
	
	}else{

		//Call error

	}
}