"""API for JS Webapp Wall application.

In real life, for us to share messages between different users of this
application, we'd want to store the messages in a server-side persistent
store (like a relational database). However, since we're demonstrating how
to use client-side session systems, this stores things there.
"""


from flask import session

# So that you can play with the `get` API, we return a single
# test message as the default.
DEFAULT_MESSAGES = [
    {'message': 'Welcome! (this is the built-in first message)'},
]


def wall_error(error):
    """Handle API errors.

        error: (string) error message

        returns: dictionary error object.
    """

    return {
        "result": error,
    }


def wall_list():
    """Get messages.

        returns: dictionary with messages list + result code.
    """

    return {
        "result": "OK",
        "messages": session.setdefault('wall', DEFAULT_MESSAGES),
    }


def wall_add(msg):
    """Set a new message.

        msg: (string) message

        returns: dictionary with messages list + result code.
    """

    wall_dict = {
        "message": msg,
    }

    session.setdefault('wall', []).append(wall_dict)

    result = wall_list()
    result["result"] = "Message Received"

    return result

def wall_reset():
    """Reset wall messages to default message only
    """
    # print session['wall']
    # print session['wall'][:-1]
    session['wall'] = DEFAULT_MESSAGES
    result = wall_list()
    result["result"] = "Wall reset to initial values."

    return result

def undo_last():
    """select last message posted to session and remove
    from message wall, ie session"""
    removeThis = session['wall'][-1]
    print removeThis['message']
    session['wall'] = session['wall'][:-1]
    removed_last_msg = wall_list()
    removed_last_msg["result"] = "Successfully removed '%s' from wall" % removeThis['message']

    return removed_last_msg


