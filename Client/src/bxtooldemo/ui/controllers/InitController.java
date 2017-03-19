package bxtooldemo.ui.controllers;

import java.io.IOException;
import java.util.List;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import bxtooldemo.adapter.core.uiservice.Analysis;
import bxtooldemo.adapter.uimodels.Change;
import bxtooldemo.adapter.uimodels.Circle;
import bxtooldemo.adapter.uimodels.UIModels;

/**
 * Servlet implementation class InitController
 */
@WebServlet("/InitController")
public class InitController extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private Analysis adapterAnalysis;
	private UIModels uimodels;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public InitController() {
        super();
        this.adapterAnalysis = new Analysis();
    }
    
    /**
     * init() method is typically used to perform servlet initialization and guaranteed 
     * to be called before the servlet handles its first request.
     */
    
    public void init(ServletConfig config) throws ServletException {
        super.init(config);
      }
    
    @Override
	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		//TODO
	}

	@Override
	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		Gson gson = new Gson();
		
		if (request.getParameter("initCanvas") != null) {
			
			initSetup(request, response, gson);
		}
		
		if (request.getParameter("loadChanges") != null) {
			
			propagateChanges(request, response, gson);
		}
		
		response.setContentType("application/json;charset=UTF-8");
		response.getWriter().println( new Gson().toJson(this.uimodels));	
	}
	
	public void initSetup(HttpServletRequest request, HttpServletResponse response, Gson gson){
		
		int blockArrayNo;
		blockArrayNo = gson.fromJson(request.getParameter("blockArrayNo"), int.class);
		
		this.adapterAnalysis.initeMoflonTool(blockArrayNo);
		this.uimodels = this.adapterAnalysis.getUIModels();
		
	}
	
    public void propagateChanges(HttpServletRequest request, HttpServletResponse response, Gson gson){
		
		String jsonCreated;
		String jsonDeleted;
		String jsonMoved;
		List<Circle> createdItems = null;
		List<Circle> deletedItems = null;
		List<Circle> movedItems = null;
		
		jsonCreated = request.getParameter("ItemsCreated");
		jsonDeleted = request.getParameter("ItemsDeleted");
		jsonMoved = request.getParameter("ItemsMoved");
		createdItems = gson.fromJson(jsonCreated, new TypeToken<List<Circle>>(){}.getType());
		deletedItems = gson.fromJson(jsonDeleted, new TypeToken<List<Circle>>(){}.getType());
		movedItems = gson.fromJson(jsonMoved, new TypeToken<List<Circle>>(){}.getType());
		
		Change change = new Change();
	    change.setCreated(createdItems);
	    change.setDeleted(deletedItems);
	    change.setMoved(movedItems);

		this.uimodels = this.adapterAnalysis.getUIModelsAfterAtomicDeltaPropagation(change);
		
	}

}
