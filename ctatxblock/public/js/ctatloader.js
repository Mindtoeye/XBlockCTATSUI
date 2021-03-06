/**-----------------------------------------------------------------------------
 $Author$
 $Date$
 $HeadURL$
 $Revision$

 -
 License:
 -
 ChangeLog:
 -
 Notes:
  
*/ 

if(typeof(CTATTarget) == "undefined" || !CTATTarget)
{
	var CTATTarget="Default";
}

var Tutor = {}; // For XBlock (for now)
var FlashVars = (FlashVars ? FlashVars : {
	admit_code: "ies",
	authenticity_token: "",
	auth_token: "none",
	BehaviorRecorderMode: "AuthorTimeTutoring",
	class_name: "Default Class",
	curriculum_service_url: "", // One of: 'OLI', 'SCORM', TutorShop url
	dataset_level_name: "none",
	dataset_level_type: "ProblemSet",
	dataset_name: "none",
	expire_logout_url: "none",
	instructor_name: "none",
	instrumentation_log: "off",
	lcId: "none",
	Logging: "ClientToService", // 'ClientToService' or 'ClientToLogServer', 'OLI'
	log_service_url: "http://pslc-qa.andrew.cmu.edu/log/server",
	problem_name: "none",
	problem_position: "none",
	problem_started_url: "none",
	problem_state_status: "empty", //  'empty', 'complete', or 'incomplete'
	question_file: "none",
	refresh_session_url: "none",
	remoteSocketPort: "80",
	remoteSocketURL: "127.0.0.1",
	restore_problem_url: "OLI", // One of: 'OLI', 'SCORM', TutorShop url
	reuse_swf: "false",
	run_problem_url: "none",
	school_name: "none",
	SessionLog: "true",
	session_id: "none",
	session_timeout: "none",
	skills: "",
	source_id: "'FLASH_PSEUDO_TUTOR", // 'FLASH_PSEUDO_TUTOR' or 'CTAT_JAVA_TUTOR'
	student_interface: "none",
	student_problem_id: "none",
	study_condition_name: "none",
	study_condition_type: "none",
	study_conditon_description: "none",
	study_name: "Study1",
	target_frame: "none",
	TutorShopDeliveryMethod: "sendandload",
	user_guid: "none",
	wmode: "opaque",
	log_to_disk_directory: "none",
	DeliverUsingOLI: "none",
	ssl: "off",
	sui: ""
});

/**
* Started with an example at: // http://www.javascriptkit.com/javatutors/loadjavascriptcss.shtml
*/
function loadjscssfile(filename, filetype)
{
	console.log ("loadjscssfile ("+filename+","+filetype+")");

    if (filetype=="js")
	{ 
		//if filename is a external JavaScript file
        var fileref=document.createElement('script')
        fileref.setAttribute("type","text/javascript")
        fileref.setAttribute("src", filename)
    }
    else if (filetype=="css")
	{ 
		//if filename is an external CSS file
        var fileref=document.createElement("link")
        fileref.setAttribute("rel", "stylesheet")
        fileref.setAttribute("type", "text/css")
        fileref.setAttribute("href", filename)
    }
	
    if (typeof fileref!="undefined")
	{
		console.log ("Loading: " + filename);
        document.getElementsByTagName("head")[0].appendChild(fileref)
	}	
};

function tutorShopParams(emptyResult) {
    var tsps = null;
    if(window && window.frameElement && (tsps = window.frameElement.getAttribute('data-params')))
		return jQuery.parseJSON(tsps);
    else
		return emptyResult;
};

// Moved this code to loadCTAT, functionality should be the same
/**
if((tutorShopParams({}))["LMS"] == "TutorShop" || CTATTarget == "Default")
{
    if(typeof CTATTutor == "undefined" || !CTATTutor)
    {
        loadjscssfile("Assets/ctat.min.js","js");
    }
    if(!(Array.prototype.some.call(document.styleSheets, function(sheet) {return sheet.href && sheet.href.includes("CTAT.css")})))
    {
        loadjscssfile("Assets/CTAT.css","css");
    }
}
*/

/**
*
*/
function dumpOLIEnvironment ()
{
	var win = window.frameElement;
		
	console.log ("OLI activity_mode (data-activitymode): " + win.getAttribute("data-activitymode"));
	console.log ("OLI activity_context_guid: (data-activitycontextguid)" + win.getAttribute("data-activitycontextguid"));
	console.log ("OLI oli_auth_token: (data-authenticationtoken)" + win.getAttribute("data-authenticationtoken"));
	console.log ("OLI resource_type_id: (data-resourcetypeid)" + win.getAttribute("data-resourcetypeid"));
	console.log ("OLI session_id: (data-sessionid)" + win.getAttribute("data-sessionid"));
	console.log ("OLI superactivity_url: (data-superactivityserver)" + win.getAttribute("data-superactivityserver"));
	console.log ("OLI activity_guid: (data-activityguid)" + win.getAttribute("data-activityguid"));	
	console.log ("OLI user_guid: (data-userguid)" + win.getAttribute("data-userguid"));
}

/**
*
*/
function loadCTAT ()
{
	console.log ("loadCTAT () Loading for target: " + CTATTarget);	
		
	var win = window.frameElement;

	/*
	* Check to see if we're running on the OLI platforms ...
	* We're using this spec as a reference: https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Using_data_attributes
	*/		 
	if (CTATTarget=="OLI")
	{
		FlashVars ['SessionLog']='false';
		FlashVars ['DeliverUsingOLI']='true';
		FlashVars ['tutoring_service_communication']='javascript';
			
		//loadjscssfile ("css/themes/default/easyui.css","css");
		//loadjscssfile ("css/themes/icon.css","css");
		//loadjscssfile ("css/CTAT.css","css");
		//loadjscssfile ("css/stattutor.css","css");

		/**
		* We can't load jquery this way because we use onload and onready from it. That
		* means we might want to replace those calls with the calls JQuery does so that
		* we don't have an immediate dependency on it.
		*/
		//loadjscssfile ("jquery/jquery-1.9.0.min.js","js");
		//loadjscssfile ("jquery/jquery.easyui.min.js","js");	
		
		loadjscssfile ("ctatjslib/ctat.min.js","js");
	
		return;
	}
	
	/*
	*
	*/
	if (CTATTarget=="Google")
	{		
		loadjscssfile ("https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js","js");
		
		loadjscssfile ("http://augustus.pslc.cs.cmu.edu/html5/ctatjslib/ctat-tutor-sidebar.min.js","js");
		
		loadjscssfile ("http://augustus.pslc.cs.cmu.edu/html5/src/google/rpcobject.js","js");
		loadjscssfile ("http://augustus.pslc.cs.cmu.edu/html5/src/google/queue.js","js");
		loadjscssfile ("http://augustus.pslc.cs.cmu.edu/html5/src/google/gasqueue.js","js");
		loadjscssfile ("http://augustus.pslc.cs.cmu.edu/html5/src/google/ctattablegoogle.js","js");
		loadjscssfile ("http://augustus.pslc.cs.cmu.edu/html5/css/google-sidebar.css","css");
				
		prepTutorArea();
		
		return;
	}
	
	/*
	*
	*/	
	if (CTATTarget=="SCORM")
	{	
		loadjscssfile ("APIWrapper.js","js");
		loadjscssfile ("dolmsfunctions.js","js");	
		loadjscssfile ("scormfs.js","js");	
		
		return;
	}	
	
	/*
	*
	*/	
	if (CTATTarget=="LTI")
	{	

		return;
	}

	/*
	* Execution in an XBlock environment is a bit different than the others. Once the XBlock Js
	* code executes (CTATXBlock.js) the loader (by calling loadCTAT ()) we should immediately 
	* continue with the rest of the execution since we do not know what else is happening on an 
	* EdX page related to load and ready as jQuery defines them.
	*/		 
	if (CTATTarget=="XBlock")
	{	
		console.log ("XBlock base url: " + baseURL );
		
		FlashVars ['DeliverUsingOLI']='true';
		FlashVars ['tutoring_service_communication']='javascript';
		FlashVars ['user_guid']=window.self.studentId;
		FlashVars ['baseUrl']=window.self.baseUrl;
		FlashVars ['handlerBaseUrl']=window.self.handlerBaseUrl;
		//FlashVars ['question_file']=window.problem_location;//window.self.href + "/" + window.self.ctatmodule + "/" + window.self.problem;
		FlashVars ['question_file']=window.self.href + "/" + window.self.ctatmodule + "/" + window.self.problem;
		
		FlashVars ['href']=window.href;
		FlashVars ['module']=window.ctatmodule;

		FlashVars ['resource_spec']=window.name;
		FlashVars ['problem']=window.problem;
		FlashVars ['src']=window.src;
		FlashVars ['dataset']=window.dataset;
		FlashVars ['level1']=window.level1;
		FlashVars ['type1']=window.type1;
		FlashVars ['level2']=window.level2;
		FlashVars ['type2']=window.type2;
		FlashVars ['logurl']=window.logurl;
		FlashVars ['name']=window.name;
		FlashVars ['logtype']=window.logtype;
		FlashVars ['diskdir']=window.diskdir;
		FlashVars ['port']=window.port;
		FlashVars ['remoteurl']=window.remoteurl;
		FlashVars ['connection']=window.connection;

		FlashVars ['saveandrestore']=window.saveandrestore;
		FlashVars ['skillstring']=window.skillstring;
		FlashVars ['problem_state_status']='incomplete';
		FlashVars ['restore_problem_url']='getVariable()';

		ctatdebug ("XBlock windows.self.studentId: " + window.self.studentId);
		ctatdebug ("XBlock windows.self.handlerBaseUrl: " + window.self.handlerBaseUrl);
		
		FlashVars ["session_id"]=("xblocksession_"+guid());
		
		console.log ("Generated question_file: " + FlashVars ['question_file']);
		
		initOnload ();
		
		if (window.hasOwnProperty('ctatOnload'))
		{
			ctatdebug ("Calling client provided ctatOnload ...");
			window['ctatOnload']();
		}
		else
		{
			ctatdebug ("No ctatOnload defined in the main window object");
		}
		
		return;
	}	

	/*
	* The target CTAT is synonymous with TutorShop. You can use this target outside of
	* TutorShop if you use the same directory structure for the css, js and brd files
	*/	
	if((tutorShopParams({}))["LMS"] == "TutorShop" || CTATTarget == "CTAT")
	{
		if(typeof CTATTutor == "undefined" || !CTATTutor)
		{
			loadjscssfile("Assets/ctat.min.js","js");
		}
		if(!(Array.prototype.some.call(document.styleSheets, function(sheet) {return sheet.href && sheet.href.includes("CTAT.css")})))
		{
			loadjscssfile("Assets/CTAT.css","css");
		}
	}
	
	/**
	* This target is available to you if you would like to either develop your own
	* Learner Management System or would like to test and run your tutor standalone.
	*/
	if (CTATTarget=="Default")
	{	
	    loadjscssfile ("http://ctat.pact.cs.cmu.edu/html5releases/latest/CTAT.css","css");		
	    loadjscssfile ("http://ctat.pact.cs.cmu.edu/html5releases/latest/ctat.min.js","js");	
	}	
}

/**
*
*/
function initOnload ()
{
	//useDebugging=true;

	console.log ("initOnload ()");

	if (CTATTarget=="OLI")
	{		
		//useDebugging=true;
		
		var win = window.frameElement;
		FlashVars ['activity_mode']=win.getAttribute("data-activitymode");
		FlashVars ['activity_context_guid']=win.getAttribute("data-activitycontextguid");
		FlashVars ['oli_auth_token']=win.getAttribute("data-authenticationtoken");
		FlashVars ['auth_token']=win.getAttribute("data-authenticationtoken");
		FlashVars ['resource_type_id']=win.getAttribute("data-resourcetypeid");
		FlashVars ['session_id']=win.getAttribute("data-sessionid");
		FlashVars ['superactivity_url']=win.getAttribute("data-superactivityserver");		
		FlashVars ['activity_guid']=win.getAttribute("data-activityguid");
		FlashVars ['deliverymode']=win.getAttribute("data-activitymode");
		FlashVars ['datamode']=win.getAttribute("data-mode");
		FlashVars ['user_guid']=win.getAttribute("data-userguid");
		
		if (!FlashVars ['activity_context_guid'])
		{
			FlashVars ['activity_context_guid']="undefined";		
		}		
		
		if (FlashVars ['activity_mode'])
		{
			if (FlashVars ['activity_mode']=='review')
			{
				FlashVars ['activity_context_guid']="undefined";
			}
		}		
				
		var tempFlashVars=tutorPrep (FlashVars);

		if (tempFlashVars ["session_id"]=="none")
		{	
			tempFlashVars ["session_id"]=("qa-test_"+guid());		
		}
		
		flashVars=new CTATFlashVars ();
		flashVars.assignRawFlashVars(tempFlashVars);	
		
		dumpOLIEnvironment ();
		
		oliDriver=new OLIDriver ();
		oliMessageHandler = new OLIMessageHandler();
		oliMessageHandler.assignHandler(oliDriver);
		oliCommLibrary=new CTATCommLibrary (oliMessageHandler,false,null);
		oliComm = new OLIComm(FlashVars["superactivity_url"]);
		oliComm.loadClientConfig();
		
		// At the end of this sequence we do not call initTutor since
		// we have to do a lot more back and forth GET calls to OLI before
		// we're ready for that. See OLIComm.js for more information
	}
	
	/*
	*
	*/	
	if (CTATTarget=="SCORM")
	{	
		initTutor ();
		
		// Once all the CTAT code has been loaded allow developers to activate custom code
		// All developers would have to do is provde the method called 'init'. This is a
		// better way of managing the order of execution since the ready function essentially
		// overwrites the body onLoad function
		
		if (window.hasOwnProperty('ctatOnload'))
		{
			window ['ctatOnload']();	
		}
		else
		{
			console.log ("Error: window.ctatOnload is not available");
		}
		
		return;
	}	
	
	/*
	*
	*/	
	if (CTATTarget=="LTI")
	{	
		initTutor ();
		
		// Once all the CTAT code has been loaded allow developers to activate custom code
		// All developers would have to do is provde the method called 'init'. This is a
		// better way of managing the order of execution since the ready function essentially
		// overwrites the body onLoad function
		
		if (window.hasOwnProperty('ctatOnload'))
		{
			window ['ctatOnload']();	
		}
		else
		{
			console.log ("Error: window.ctatOnload is not available");
		}
					
			return;
	}		
	
	if (CTATTarget=="XBlock")
	{
		// We should aready be done here, no interaction with the server needed
		
		var tempFlashVars=tutorPrep (FlashVars);

		if (tempFlashVars ["session_id"]=="none")
		{	
			tempFlashVars ["session_id"]=("qa-test_"+guid());		
		}
		
		flashVars=new CTATFlashVars ();
		flashVars.assignRawFlashVars(tempFlashVars);
		
		Tutor.name = window.name;
		Tutor.webcontent = "problem_files/"+window.ctatmodule+"/";
		Tutor.data = Tutor.webcontent+window.name;
		Tutor.problem_description = Tutor.name+".xml";
		Tutor.brd = Tutor.name+".brd";
		
		if (window.hasOwnProperty('ctatPreload'))
		{
			ctatPreload();
		}
		else
		{
			console.log ("ctatPreload () not defined, only used in ctat stattutor");
			initTutor (); // ctatPreload() calls initTutor.
		}

		return;	
	}	
	
	/*
	* The target CTAT is synonymous with TutorShop. You can use this target outside of
	* TutorShop if you use the same directory structure for the css, js and brd files
	*/	
	if (CTATTarget=="CTAT")
	{
		initTutor (CTATGlobalFunctions.decodeTutorShopParams());
		
		// Once all the CTAT code has been loaded allow developers to activate custom code
		// All developers would have to do is provde the method called 'init'. This is a
		// better way of managing the order of execution since the ready function essentially
		// overwrites the body onLoad function
		
		if (window.hasOwnProperty('ctatOnload'))
		{
			window ['ctatOnload']();
		}
		else
		{
			console.log ("Error: window.ctatOnload is not available");
		}
		
		return;
	}
	
	/*
	* This target is available to you if you would like to either develop your own
	* Learner Management System or would like to test and run your tutor standalone.
	*/
	if (CTATTarget=="Default")
	{
		initTutor (CTATGlobalFunctions.decodeTutorShopParams());
		
		// Once all the CTAT code has been loaded allow developers to activate custom code
		// All developers would have to do is provde the method called 'init'. This is a
		// better way of managing the order of execution since the ready function essentially
		// overwrites the body onLoad function
		
		if (window.hasOwnProperty('ctatOnload'))
		{
			window ['ctatOnload']();
		}
		else
		{
			console.log ("Error: window.ctatOnload is not available");
		}
		
		return;
	}	
}

/**
*
*/
function OLIReady ()
{
	console.log ("OLIReady ()");
	
	if (window.hasOwnProperty('ctatPreload'))
	{
		window['ctatPreload']();
	}
		
	// delay initTutor() call until ctatPreload in tutor.html has retrieved the problem data ...
	// initTutor (flashVars.getRawFlashVars());
	
	// Once all the CTAT code has been loaded allow developers to activate custom code
	// All developers would have to do is provde the method called 'init'. This is a
	// better way of managing the order of execution since the ready function essentially
	// overwrites the body onLoad function
	if (window.hasOwnProperty('ctatOnload'))
	{
		window ['ctatOnload']();	
	}
	else
	{
		console.log ("Error: window.ctatOnload is not available");
	}
}

//>---------------------------------------------------------------------------------
// Below we setup the two main events handlers that govern the execution cycle of
// a tutor. ready() is called whenever the main html has been loaded by the browser but
// not executed. load() is called when all css and js files have been loaded and parsed,
// including all the ones we told the browser to load in loadCTAT ()
//>---------------------------------------------------------------------------------

$(document).ready(function() 
{
	console.log ("ready ("+CTATTarget+")");
	
	if (CTATTarget=="CTAT")
	{
		console.log ("Checking target: " + CTATTarget);

		if (window ['XBlock'])
		{
			console.log ("Forcing target platform to be XBlock, loadCTAT () will be called by the EdX Xblock code ...");
			
			CTATTarget="XBlock";
			return;
		}
		else
		{
			console.log ("window ['XBlock'] is not XBlock: " + window ['XBlock'] + "; CTATTarget is " + CTATTarget);
		}
	}

	if (CTATTarget!="XBlock")
	{
		loadCTAT ();
	}
	else	
	{
		console.log ("We can't execute loadCTAT () in $(document).ready(), because the actual XBlock needs to start first. It will call loadCTAT instead");
	}
});

$(window).load(function() 
{
	console.log ("load ()");
	
	//useDebugging=true;	
	
	// Load any static resources you need for this tutor. For example the OLI version
	// uses this time to generate a static reference to the BRD file so that it can
	// assign it to the question_file FlashVar
	
	if (CTATTarget=="XBlock")
	{
		console.log ("We should not call initOnload in the XBlock case since that is all driven by CTATXBlock and the loadCTAT code above");
	}
	else
	{
		initOnload ();
	}	
});

function translateResourceFile (aURL)
{
	if (CTATTarget=="OLI")
	{
		return (oliDriver.translateOLIResourceFile (aURL));
	}

	if (CTATTarget=="XBlock")
	{
		return (xblockpointer.translateResourceFile (aURL));
	}	
	
	return (aURL);
}
