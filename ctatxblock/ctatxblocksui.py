# -------------------------------------------------------------------
#
#
# -------------------------------------------------------------------

import os
import pprint
import pkg_resources
import base64
import glob
import re
import socket

from string import Template

from xblock.core import XBlock
from xblock.fields import Scope, Integer, String, Float, Boolean
from xblock.fragment import Fragment

dbgopen=False;
tmp_file=None;

# -------------------------------------------------------------------
#
#
# -------------------------------------------------------------------
class CTATXBlock(XBlock):

    has_score = True;

    # Fields are defined on the class.  You can access them in your code as
    # self.<fieldname>.
    href = String(help="URL to a BRD file", default="http://augustus.pslc.cs.cmu.edu/html5/", scope=Scope.settings)
    ctatmodule = String(help="The learning module to load from", default="HTML5TestFiles", scope=Scope.settings)
    name = String(help="Problem name to log", default="CTATEdXProblem", scope=Scope.settings)
    problem = String(help="The name of a BRD file", default="1416-worked.brd", scope=Scope.settings)
    dataset = String(help="Dataset name to log", default="edxdataset", scope=Scope.settings)
    level1 = String(help="Level name to log", default="unit1", scope=Scope.settings)
    type1 = String(help="Level type to log", default="unit", scope=Scope.settings)
    level2 = String(help="Level name to log", default="unit2", scope=Scope.settings)
    type2 = String(help="Level type to log", default="unit", scope=Scope.settings)
    logurl = String(help="URL of the logging service", default="http://pslc-qa.andrew.cmu.edu/log/server", scope=Scope.settings)
    logtype = String(help="How should data be logged", default="clienttologserver", scope=Scope.settings)
    diskdir = String(help="Directory for log files relative to the tutoring service", default=".", scope=Scope.settings)
    port = String(help="Port used by the tutoring service", default="8080", scope=Scope.settings)
    remoteurl = String(help="Location of the tutoring service (localhost or domain name)", default="localhost", scope=Scope.settings)
    connection = String(help="", default="javascript", scope=Scope.settings)

    saveandrestore = String(help="Internal data blob used by the tracer", default="", scope=Scope.user_state)
    skillstring = String(help="Internal data blob used by the tracer", default="", scope=Scope.user_state)

    weight = Float(
        display_name="Problem Weight",
        help=("Defines the number of points each problem is worth. "
              "If the value is not set, the problem is worth the sum of the "
              "option point values."),
        values={"min": 0, "step": .1},
        scope=Scope.settings
    )

    done = Boolean(
        scope=Scope.user_state,
        help="Is the student done?",
        default=False
    )

    def logdebug (self, aMessage):
        global dbgopen, tmp_file
        if (dbgopen==False):
            tmp_file = open("/tmp/edx-tmp-log-ctat.txt", "a", 0)
            dbgopen=True
        tmp_file.write (aMessage + "\n")

    def resource_string(self, path):
        data = pkg_resources.resource_string(__name__, path)        
        return data.decode("utf8")

    def bind_path (self, text):
        tbase=self.runtime.local_resource_url (self,"public/ref.css")
        self.logdebug (self,'local_resource_url: ' + tbase)
        base=tbase[:-7]
        self.logdebug (self,'local_resource_url (adjusted): ' + base)
        return (text.replace ("[xblockbase]",base))

    def strip_local (self, url):
        # Returns the given url with //localhost:port removed.
        return re.sub('//localhost(:\d*)?', '', url)

    # -------------------------------------------------------------------
    # TO-DO: change this view to display your data your own way.
    # -------------------------------------------------------------------

    def student_view(self, context=None):
        self.logdebug ("student_view ()")
        self.logdebug ("Hostname: " + socket.getfqdn())
        self.logdebug ("Base URL: " + self.strip_local(self.runtime.local_resource_url(self, 'public/')))
        baseURL=self.strip_local(self.runtime.local_resource_url (self,"public/problem_files/ref.css"));
        html = self.resource_string("static/html/ctatxblock.html")
        frag = Fragment(html.format(self=self))
        frag.add_css_url(self.strip_local((self.runtime.local_resource_url (self,"public/css/ctat.css"))))
        frag.add_css_url(self.strip_local((self.runtime.local_resource_url (self,"public/css/ctatxblock.css"))))
        frag.add_javascript ("var baseURL=\""+(baseURL [:-7])+"\";")
        frag.add_javascript_url(self.strip_local((self.runtime.local_resource_url (self,"public/js/ctat.min.js"))))
        frag.add_javascript_url(self.strip_local((self.runtime.local_resource_url (self,"public/js/ctatloader.js"))))
        frag.add_content (self.resource_string("static/html/body.html"));
        frag.initialize_js('CTATXBlock')
        return frag

    # -------------------------------------------------------------------
    # TO-DO: change this view to display your data your own way.
    # -------------------------------------------------------------------
    def studio_view(self, context=None):
        self.logdebug ("studio_view ()")
        html = self.resource_string("static/html/ctatstudio.html")
        frag = Fragment(html.format(self=self))
        frag.add_javascript_url(self.strip_local(self.runtime.local_resource_url (self,"public/js/ctatstudio.js")))
        frag.add_css_url(self.strip_local(self.runtime.local_resource_url (self,"public/css/ctatstudio.css")))
        frag.initialize_js('CTATXBlockStudio')        
        return frag

    # --------------------------------------------------------------------
    # More on grade handling:
    # https://github.com/pmitros/DoneXBlock/blob/master/done/done.py
    # --------------------------------------------------------------------
    @XBlock.json_handler
    def ctat_grade(self, data, suffix=''):
        self.logdebug ("ctat_grade ()")
        self.attempted = True
        self.score = data['value']
        #self.max_score = data['max_value']
        #self.completed = self.score >= self.max_score
        #event_data = {'value': self.score, 'max_value': self.max_score}
        #event_data = {value : self.score, max_value : 1.0}
        grade_event = {'value': 0.5, 'max_value': 1}
        self.runtime.publish(self, "grade", grade_event)
        #self.runtime.publish(self, "edx.done.toggled", {'done': self.done})
        return {'state': self.done}

    @XBlock.json_handler
    def studio_submit(self, data, suffix=''):
        self.logdebug ('studio_submit()')
        return {'result': 'success'}

    @XBlock.json_handler
    def ctat_set_variable(self, data, suffix=''):
        self.logdebug ("ctat_set_variable ()")

        for key in data:
            #value = base64.b64decode(data[key])
            value = data[key]
            self.logdebug("Setting ({}) to ({})".format(key, value))
            if (key=="href"):
               self.href = value
            elif (key=="ctatmodule"):
               self.ctatmodule = value
            elif (key=="problem"):
               self.problem = value
            elif (key=="dataset"):
               self.dataset = value
            elif (key=="level1"):
               self.level1 = value
            elif (key=="type1"):
               self.type1 = value
            elif (key=="level2"):
               self.level2 = value
            elif (key=="type2"):
               self.type2 = value
            elif (key=="logurl"):
               self.logurl = value
            elif (key=="logtype"):
               self.logtype = value
            elif (key=="diskdir"):
               self.diskdir = value
            elif (key=="port"):
               self.port = value
            elif (key=="remoteurl"):
               self.remoteurl = value
            elif (key=="connection"):
               self.connection = value
            #elif (key=="src"):
            #   self.src = value
            elif (key=="saveandrestore"):
               self.logdebug ("Received saveandrestore request")
               self.saveandrestore = value
            #elif (key=="skillstring"):
            #  self.skillstring = value

        return {'result': 'success'}

    # -------------------------------------------------------------------
    # TO-DO: change this to create the scenarios you'd like to see in the
    # workbench while developing your XBlock.
    # -------------------------------------------------------------------
    @staticmethod
    def workbench_scenarios():
        return [
            ("CTATXBlock",
             """<vertical_demo>
                <ctatxblock/>
                </vertical_demo>
             """),
        ]

    def max_score(self):
        # The maximum raw score of our problem.
        return 1