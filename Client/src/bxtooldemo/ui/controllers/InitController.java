package bxtooldemo.ui.controllers;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;

import bxtooldemo.ui.core.ClientObservable;
import bxtooldemo.ui.models.Canvas;
import bxtooldemo.ui.models.Item;



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
		
//		List<Item> items = new ArrayList<Item>();
//		 Item a = new Item();
//		 a.name = "Sink";
//		 Item b = new Item();
//		 b.name = "Sink";
//		 
//		items.add(a);
//		items.add(b);
		Canvas canvas = new Canvas(500, 500);
        ClientObservable clientObser = new ClientObservable();
		clientObser.setCanvas(canvas);
		System.out.println("inside doGet of InitController after canvas is initialized");

	     //if (items != null){
		
		   //ServletOutputStream outputStream = response.getOutputStream();
	    	//outputStream.print(new Gson().toJson(w1.objects));
	    	 
		   response.setContentType("application/json;charset=UTF-8");
		   response.getWriter().println( new Gson().toJson(canvas));
	    // }	
		
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		//doGet(request, response);
	}

}
