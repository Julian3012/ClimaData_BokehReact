from flask import Flask, render_template

from bokeh.client import pull_session,push_session
from bokeh.embed import server_session

app = Flask(__name__)
# app_url = "http://localhost:5010/bokeh_session"
app_url = "http://localhost:5010/main_local"

@app.route('/', methods=['GET'])
def bkapp_page():

    # pull a new session from a running Bokeh server
    with push_session(url=app_url) as session:

        # update or customize that session
        session.document.roots[0].children[1].title.text = "Special Sliders For A Specific User!"

        # generate a script to load the customized session
        script = server_session(session_id=session.id, url=app_url)

        # use the script in the rendered page
        # return render_template("embed.html", script=script, template="Flask")

if __name__ == '__main__':
    app.run(port=8080, debug=True)
