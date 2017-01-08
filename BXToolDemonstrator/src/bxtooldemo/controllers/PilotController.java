package bxtooldemo.controllers;

import java.io.IOException;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import bxtooldemo.businesslayer.Initializer;

/**
 * Servlet implementation class PilotController
 */
@WebServlet("/PilotController")
public class PilotController extends HttpServlet {
	private static final long serialVersionUID = 1L;
	public int blockSize = 0;
        
    /**
     * @see HttpServlet#HttpServlet()
     */
    public PilotController() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
		Initializer initializer = new Initializer();
		this.blockSize = initializer.initialize(500, 500);
		
		request.setAttribute("blocksize", this.blockSize);
		RequestDispatcher requestDispatcher = request.getRequestDispatcher("GUI.jsp");
		requestDispatcher.forward(request, response);
	}

}
