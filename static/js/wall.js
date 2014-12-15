$(document).ready(function () {
    // Normally, JavaScript runs code at the time that the <script>
    // tags loads the JS. By putting this inside a jQuery $(document).ready()
    // function, this code only gets run when the document finishing loading.
    $.get("/api/wall/list", function (result) {
        console.log("result of calling '/api/wall/list'", result);
        if (result.result == "OK") {
            $("#message-container").empty();
            for (var n = 0; n < result.messages.length; n++) {
                // console.log("message in session: " + result.messages[n].message);
                // $("<li class='list-group-item'>"+result.messages[n].message+"</li>").hide().prependTo("#message-container").slideUp("slow");
                $("#message-container").prepend("<li class='list-group-item'>"+result.messages[n].message+"</li>");
            }
        }
    });

    $("#message-form").submit(handleFormSubmit);

    $("#reset-wall").click(resetWall);

    $("#undo-last").click(undoLastMsg);
});

/**
 * Handle submission of the form.
 */
function handleFormSubmit(evt) {
    // prevent another post for 5 sec 
    delayNextPost();

    // do not submit form yet (default action) 
    evt.preventDefault();

    // do all of this first
    var textArea = $("#message");
    var msg = textArea.val();
    msg = $("<html>" + msg + "</html>").text();

    console.log("msg without html from handleFormSubmit: ", msg);
    
    // now submit form and post question
    if (msg == null) {

    }
    addMessage(msg);

    // Reset the message container to be empty
    textArea.val("");
}

function delayNextPost(evt) {
    
    $("#message-send").prop("disabled", true);

    var self = this;

    setTimeout(function () {
        $("#message-send").prop("disabled", false);
      }, 1000);
}

/**
 * Makes AJAX call to the server and the message to it.
 */
function addMessage(msg) {
    $.post(
        "/api/wall/add",
        {'m': msg},
        function (data) {
            console.log(data);
            if (!("messages" in data)) {
                console.log("we have an error!");
                // displayResultStatus(data.result);
                if (data.result == "Your message is empty") {
                    var error = "Your message is empty";
                }
                else {
                    error = "You did not specify a message to set.";
                }
                displayResultStatus(data.result);
            }
            else if (data.messages) {
                console.log("not an error here");
                displayResultStatus(data.result);
                var msg = data.messages[data.messages.length - 1].message;
                console.log(msg,"\nis message text");
                $("<li class='list-group-item'>"+msg+"</li>")
                    .hide().prependTo("#message-container").slideDown("slow");
            }
        }
    );
}

function resetWall(evt) {
    console.log("clicked reset button");
    confirmReset = confirm("Delete all messages and reset to default?");

    if (confirmReset == true) {
        $.post(
            "/api/wall/reset",
            {},
            function (result) {
                console.log("session messages reset to default:", result);
                // var itemToRemove = $("#message-container li:eq("+n+")");
                var ListOfItems = $("#message-container >li");
                for (n=0;n<ListOfItems.length-1;n++) {
                    var itemToRemove = $("#message-container li:eq("+n+")");
                    console.log(itemToRemove);
                    itemToRemove.slideUp("slow");
                }
            }
        );    
    }
    
}

function removeChild() {
    $("#message-container > li:first-child").remove();
}

function undoLastMsg(evt) {
    reallyDelete = confirm("Last Message:\n" + $("#message-container > li:first-child").text() 
        +"\n\nSelect OK to confirm delete.");

    if (reallyDelete == true) {
        // alert("Deleting last message");
        $.post(
            "/api/wall/undo",
            {},
            function (result) {
                console.log("messages now:", result);
                $("#message-container > li:first-child").slideUp("slow", removeChild);
            }
        );
    }
}

/**
 * This is a helper function that does nothing but show a section of the
 * site (the message result) and then hide it a moment later.
 */
function displayResultStatus(resultMsg) {
    var notificationArea = $("#sent-result");

    notificationArea.text(resultMsg);
    $("#sent-result").removeClass("alert alert-info").addClass("alert alert-success");
    if (resultMsg == "You did not specify a message to set.") {
        console.log("no message error");
        $("#sent-result").addclass("alert alert-danger").text(resultMsg + "\nThat's not gonna fly");
    }
    else if (resultMsg == "Your message is empty") {
        console.log("empty error");
        $("#sent-result").addClass("alert alert-danger").text(resultMsg + ". That's not gonna fly.");
    }
    // else {
    //     console.log($("#sent-result"));
    //     $("#sent-result").addClass("alert alert-success").text("do we get here?");
    // }
    console.log("error check", resultMsg);
    notificationArea.slideDown(function () {
        // In JavaScript, "this" is a keyword that means "the object this
        // method or function is called on"; it is analogous to Python's
        // "self". In our case, "this" is the #sent-results element, which
        // is what slideDown was called on.
        //
        // However, when setTimeout is called, it won't be called on that
        // same #sent-results element--"this", for it, wouldn't be that
        // element. We could put inside of our setTimeout call the code
        // to re-find the #sent-results element, but that would be a bit
        // inelegant. Instead, we'll use a common JS idiom, to set a variable
        // to the *current* definition of self, here in this outer function,
        // so that the inner function can find it and where it will have the
        // same value. When stashing "this" into a new variable like that,
        // many JS programmers use the name "self"; some others use "that".
        var self = this;

        setTimeout(function () {
            $(self).slideUp();
        }, 2000);
    });
}