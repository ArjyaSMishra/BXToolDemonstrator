package bxtooldemo.ui.controllers;

import java.io.IOException;
import java.util.Observer;
import java.util.Optional;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.google.gson.Gson;

import bxtooldemo.adapter.core.uiservice.Analysis;
import bxtooldemo.adapter.uimodels.Canvas;
import bxtooldemo.adapter.uimodels.UIModels;
import bxtooldemo.ui.core.ClientObservable;



/**
 * Servlet implementation class InitController
 */
@WebServlet("/InitController")
public class InitController extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public InitController() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		//response.getWriter().append("Served at: ").append(request.getContextPath());
		
		Analysis adapterAnalysis = new Analysis();
		UIModels uimodels = new UIModels();
		
//		Canvas canvas = new Canvas(500, 500);
//        ClientObservable clientObser = new ClientObservable();
//        createObserver().ifPresent(o -> clientObser.attach(o));
//		clientObser.setCanvas(canvas);
		
		uimodels = adapterAnalysis.getUIModels();
		   //ServletOutputStream outputStream = response.getOutputStream();
	    	//outputStream.print(new Gson().toJson(w1.objects));
	    	 
		   response.setContentType("application/json;charset=UTF-8");
		   response.getWriter().println( new Gson().toJson(uimodels));	
	}

	private Optional<Observer> createObserver() {
		Class<Observer> obClass;
		try {
			//obClass = (Class<Observer>) this.getClass().getClassLoader().loadClass("bxtooldemo.adapter.core.AdapterObserver");
			obClass = (Class<Observer>)Class.forName("bxtooldemo.adapter.core.AdapterObserver");
			Observer ob = obClass.newInstance();
			return Optional.of(ob);
		} catch (ClassNotFoundException | InstantiationException | IllegalAccessException e) {
			e.printStackTrace();
		}
		
		return Optional.empty();
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		//doGet(request, response);
	}

}
