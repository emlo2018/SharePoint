'use strict';

ExecuteOrDelayUntilScriptLoaded(initializePage, "sp.js");

function initializePage() {
    var appContext = new SP.ClientContext.get_current();
    var currentUser = appContext.get_web().get_currentUser();

    var hostURL = decodeURIComponent(getQueryStringParameter("SPHostUrl"));
    var hostContext = new SP.AppContextSite(appContext, hostURL);
    var parentWeb = hostContext.get_web();
    var listRowCollection = parentWeb.get_lists().getByTitle('Annonser').getItems("");
    


    // This code runs when the DOM is ready and creates a context object which is needed to use the SharePoint object model
    $(document).ready(function () {
        
        getUserName();

    });
    $(document).ready(function () {
        $("#Datum").datepicker();
    });



    // This function prepares, loads, and then executes a SharePoint query to get the current users information
    function getUserName() {
        appContext.load(currentUser);
        appContext.executeQueryAsync(onGetUserNameSuccess, onGetUserNameFail);
    }

    // This function is executed if the above call is successful
    // It replaces the contents of the 'message' element with the user name
    function onGetUserNameSuccess() {
        $('#username').text('Welcome ' + currentUser.get_title());
        var createdUser = _spPageContextInfo.userDisplayName;
        //document.getElementById("Creator").value = createdUser;

        SokKurs();

        
    }

    // This function is executed if the above call fails
    function onGetUserNameFail(sender, args) {
        alert('Failed to get user name. Error:' + args.get_message());
    }
}




    function showItemInDetail(id) {
        //Skapar ett context objekt som pekar på appwebben
        var appContext = new SP.ClientContext.get_current();
        //Tar fram URL till hostwebben
        var hostURL = decodeURIComponent(getQueryStringParameter("SPHostUrl"));
        //Skapar ett context objekt som pekar på hostwebben
        var hostContext = new SP.AppContextSite(appContext, hostURL);
        var oList = hostContext.get_web().get_lists().getByTitle("Annonser");
        var oListItem = oList.getItemById(id);
        var currentUser = appContext.get_web().get_currentUser();

        appContext.load(oList);
        appContext.load(oListItem);

        appContext.executeQueryAsync(onSucc, onFail);

        function onSucc() {
            
            var listHtmlString = "";
            var user = currentUser.get_title();

           
            //details för olika besökare
            if (user === oListItem.get_item('Creator').get_lookupValue()) {
                 listHtmlString = "<div> Title: " + oListItem.get_item("Title") + "</div>" + "<br/>" +
                    "<div> Description: " + oListItem.get_item("Text") + "</div>" + "<br/>" +
                    "<div> " + oListItem.get_item("Pris") + " Kronor </div>" + "<br/>" +
                    "<div> Startdate: " + oListItem.get_item("Datum").format("dd-MM-yyyy") + "</div>" + "<br/>" +
                    "<div> Category: " + oListItem.get_item("Kategori") + "</div>" + "<br/>" + 
                    "<button type='button' onclick=changeAdvert(" + oListItem.get_item('ID') + ")>Save update</button>" +
                    "<button type='button' onclick=deleteTask(" + oListItem.get_item('ID') + ")>Delete</button>" + "<br/> ";
                //besökare som inte skapat annonsen
            } else {
                 listHtmlString = "<div> Title: " + oListItem.get_item("Title") + "</div>" + "<br/>" +
                    "<div> Description: " + oListItem.get_item("Text") + "</div>" + "<br/>" +
                    "<div> " + oListItem.get_item("Pris") + " Kronor </div>" + "<br/>" +
                    "<div> Startdate: " + oListItem.get_item("Datum").format("dd-MM-yyyy") + "</div>" + "<br/>" +
                    "<div> Category: " + oListItem.get_item("Kategori") + "</div>" + "<br/>"; }
                
            //document.getElementById("#detailsDiv").innerHTML = listHtmlString;
            console.log(listHtmlString);
            $("#detailsDiv").html(listHtmlString);
            
           
        }

        function onFail() {
            alert("Something is wrong with show items");
        }
}

function getRows() {
    var appContext = new SP.ClientContext.get_current();
    var currentUser = appContext.get_web().get_currentUser();

    //Tar fram URL till hostwebben
    var hostURL = decodeURIComponent(getQueryStringParameter("SPHostUrl"));

    //Skapar ett context objekt som pekar på hostwebben
    var hostContext = new SP.AppContextSite(appContext, hostURL);

    //Objekt som pekar på web objektet
    var parentWeb = hostContext.get_web();

    //Objekt som pekar på alla rader i listan
    var listRowCollection = parentWeb.get_lists().getByTitle('Annonser').getItems("");

    appContext.load(currentUser);
    appContext.load(listRowCollection);
    appContext.executeQueryAsync(onSuccess, onFail);


    //Tar emot svaret med alla rader i listan
    function onSuccess() {
        var listString = "";        
        var listEnumerator = listRowCollection.getEnumerator();

        //Loopar igenom alla rader i listan som finns i en collection
        while (listEnumerator.moveNext()) {

      

            //Tar fram aktuell rad
            var currentItem = listEnumerator.get_current();

            var selectedId = currentItem.get_id();

            var user = currentUser.get_title();
            
            

            //Tar fram värdet i alla kolumner

            if (user === currentItem.get_item('Creator').get_lookupValue()) {

                listString += "<br/> " + "<div> Titel: " + currentItem.get_item('Title') + "</div>" + "<br/> " +
                    "<div> Description: " + " " + currentItem.get_item('Text') + "</div>" + "<br/> " +
                    "<div> Price: " + " " + currentItem.get_item('Pris') + "</div>" + "<br/> " +
                    "<div> Created by: " + " " + currentItem.get_item('Creator').get_lookupValue() + "</div>" + "<br/> " +
                    "<div> Startdate: " + " " + currentItem.get_item('Datum').format("dd-MM-yyyy") + "</div>" + "<br/> " +
                    "<div> Category: " + " " + currentItem.get_item('Kategori') + "   " + "</div>" + "<br/> ";
                    //`<span id="${selectedId}">` + "</span>" + 
                    //"<br/>" +
                    //"<button type='button' onclick=changeAdvert(" + currentItem.get_item('ID') + ")>Save update</button>" + 
                    //"<button type='button' onclick=deleteTask(" + currentItem.get_item('ID') + ")>Delete</button>" + "<br/> ";
                
            }
            else {
                //Här är det visst tomt
                
            }
            //Lägger ut i message elementet på sidan
            $('#message').html(listString);

        }

    }
    // This function is executed if the above call fails
    function onFail(sender, args) {
        alert('Error:' + args.get_message());
    }


}

function getValues(id) {
    console.log("inne i getvalues");
    //Skapar ett context objekt som pekar på appwebben
    var appContext = new SP.ClientContext.get_current();

    //Tar fram URL till hostwebben
    var hostURL = decodeURIComponent(getQueryStringParameter("SPHostUrl"));

    //Skapar ett context objekt som pekar på hostweb
    var hostContext = new SP.AppContextSite(appContext, hostURL);

    //Objekt som pekar på web objektet
    var parentWeb = hostContext.get_web();

    //Objekt som pekar på alla rader i listan
    var list = parentWeb.get_lists().getByTitle('Annonser');

    var updateTask = list.getItemById(id);
    updateTask.set_item("Title", document.getElementById("Title").value);
    updateTask.set_item("Text", document.getElementById("Text").value);
    updateTask.set_item("Pris", document.getElementById("Pris").value);
    updateTask.set_item("Datum", document.getElementById("Datum").value);
    updateTask.set_item("Creator", document.getElementById("Creator").value);
    updateTask.set_item("Kategori", document.getElementById("Kategori").value);
    updateTask.update();

    appContext.load(updateTask);
    appContext.executeQueryAsync(ongetSuccess, ongetFail);

    function ongetSuccess() {


        alert("done");

    }

    function ongetFail() {

        alert("Something went wrong in getValues!");
    }
}

function onQueryFailed(sender, args) {
    alert('Request failed. ' + args.get_message() +
        '\n' + args.get_stackTrace());
}


function saveClick(sU) {
    var title = document.getElementById('Title').value;
    var text = document.getElementById('Text').value;
    var pris = document.getElementById('Pris').value;
    var datum = document.getElementById('Datum').value;
    var kategori = document.getElementById('Kategori').value;
    
    //Skapar ett context objekt som pekar på appwebben
    var appContext = new SP.ClientContext.get_current();

    //Tar fram URL till hostwebben
    var hostURL = decodeURIComponent(getQueryStringParameter("SPHostUrl"));

    //Skapar ett context objekt som pekar på hostwebben
    var hostContext = new SP.AppContextSite(appContext, hostURL);

    var myUser = hostContext.get_web().get_currentUser();

     

    var list = hostContext.get_web().get_lists().getByTitle('Annonser');

    var creationInfo = SP.ListItemCreationInformation();

    var olist = list.addItem(creationInfo);

    olist.set_item("Title", title);
    olist.set_item("Text", text);
    olist.set_item("Pris", pris);
    olist.set_item("Datum", datum);
    olist.set_item("Creator", myUser);
    olist.set_item("Kategori", kategori);
    olist.update();

    appContext.load(olist);
    appContext.executeQueryAsync(OnSuccess, OnFailure);

    function OnSuccess() {

        alert("Saved successfully");
    }

    function OnFailure() {

        alert("Not working");

    }
}

function deleteTask(id) {

    //Skapar ett context objekt som pekar på appwebben
    var appContext = new SP.ClientContext.get_current();

    //Tar fram URL till hostwebben
    var hostURL = decodeURIComponent(getQueryStringParameter("SPHostUrl"));

    //Skapar ett context objekt som pekar på hostwebben
    var hostContext = new SP.AppContextSite(appContext, hostURL);

    //Objekt som pekar på web objektet
    var parentWeb = hostContext.get_web();

    //Objekt som pekar på alla rader i listan
    var list = parentWeb.get_lists().getByTitle('Annonser');



    var listItem = list.getItemById(id);
    listItem.deleteObject();

    appContext.executeQueryAsync(onDeleteSuccess, onDeleteFail);


    function onDeleteSuccess() {
        alert("Deleted");
        
    }

    function onDeleteFail() {
        alert("Not deleted");
    }
}



function SokKurs() {

    //Skapar ett context objekt som pekar på appwebben
    var appContext = new SP.ClientContext.get_current();

    //Tar fram URL till hostwebben
    var hostURL = decodeURIComponent(getQueryStringParameter("SPHostUrl"));

    //Skapar ett context objekt som pekar på hostwebben
    var hostContext = new SP.AppContextSite(appContext, hostURL);

    //Objekt som pekar på web objektet
    var parentWeb = hostContext.get_web();

    //Objekt som pekar på alla rader i listan
    var listRowCollection = parentWeb.get_lists().getByTitle('Annonser').getItems("");

    appContext.load(listRowCollection);
    appContext.executeQueryAsync(onSuccessSearch, onFailSearch);



    function onSuccessSearch() {
        //getRows();
        
        var listEnumerator = listRowCollection.getEnumerator();

        var dataSet = [];

        while (listEnumerator.moveNext()) {

            var currentItem = listEnumerator.get_current();

            var tempData =
            {
                "Title": currentItem.get_item("Title"),
                "Text": currentItem.get_item("Text"),
                "Datum": currentItem.get_item("Datum").format("dd-MM-yyyy"),
                "Pris": currentItem.get_item("Pris"),
                "Creator": currentItem.get_item("Creator").get_lookupValue(),
                "More": "<button class='button' type='button'onclick='showItemInDetail(" + currentItem.get_item('ID') + ")'>More</button>"
                //type='button' är tveksam
            };

            dataSet.push(tempData);
        }

        $('#table').DataTable({
            data: dataSet,
            columns: [
                { title: "Title", data: "Title" },
                { title: "Text", data: "Text" },
              //{ title: "Datum", data: "Datum" },
                { title: "Pris", data: "Pris" },
                { title: "Creator", data: "Creator" },
                { title: "More", data: "More" }
             ]
        });
    }

    function onFailSearch() {
        alert("Error in search");
    }

}

function changeAdvert(id) {

    
    //Skapar ett context objekt som pekar på appwebben
    var appContext = new SP.ClientContext.get_current();

    //Tar fram URL till hostwebben
    var hostURL = decodeURIComponent(getQueryStringParameter("SPHostUrl"));

    //Skapar ett context objekt som pekar på hostwebben
    var hostContext = new SP.AppContextSite(appContext, hostURL);


    var oList = hostContext.get_web().get_lists().getByTitle("Annonser");

    var oListItem = oList.getItemById(id);

    var title = document.getElementById('Title').value;
    var text = document.getElementById('Text').value;
    var pris = document.getElementById('Pris').value;
    var datum = document.getElementById('Datum').value;
    var kategori = document.getElementById('Kategori').value;

    oListItem.set_item("Title", title);
    oListItem.set_item("Text", text);
    oListItem.set_item("Pris", pris);
    oListItem.set_item("Datum", datum);
    oListItem.set_item("Kategori", kategori);
    oListItem.update();



    appContext.load(oList);


     appContext.executeQueryAsync(onSuccess, onFail);

    function onSuccess() {
        

        alert("Updated!");

    }
    function onFail() {
        alert("something went wrong");
    }
  



}



function clearInput() {
    var inputElements = document.getElementsByTagName("input");
    for (var i = 0; i < inputElements.length; i++) {
        if (inputElements[i].type === 'text') {
            inputElements[i].value = '';
        }

    }
}

//Funktion för att ta fram värde
function getQueryStringParameter(paramToRetrieve) {
    var params =
        document.URL.split("?")[1].split("&");
    var strParams = "";
    for (var i = 0; i < params.length; i = i + 1) {
        var singleParam = params[i].split("=");
        if (singleParam[0] === paramToRetrieve)
            return singleParam[1];
    }
}
