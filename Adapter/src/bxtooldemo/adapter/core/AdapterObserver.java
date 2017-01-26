package bxtooldemo.adapter.core;

import java.util.Observable;
import java.util.Observer;

import GridLanguage.Grid;
import KitchenLanguage.Kitchen;
import bxtooldemo.adapter.core.implementations.emoflon.KitchenToGrid;
import bxtooldemo.adapter.core.uiservice.Analysis;
import bxtooldemo.adapter.uimodels.Canvas;
import bxtooldemo.adapter.uimodels.UIModels;


public class AdapterObserver implements Observer{

//	protected ClientObservable clientObservable;
//	public AdapterObserver(ClientObservable clientObservable){
//	      this.clientObservable = clientObservable;
//	      this.clientObservable.attach(this);
//	   }
	
//	public AdapterObserver(){
//	      
//	   }
	
	@Override
	public void update(Observable arg0, Object arg1) {
		// TODO Auto-generated method stub
		
		System.out.println("start update in observerbn");
		KitchenToGrid kitchenToGrid = new KitchenToGrid();
		System.out.println("inside update here 11");
		kitchenToGrid.initiateSynchronisationDialogue();
		System.out.println("inside update -- after init");
		
		Grid grid = kitchenToGrid.getSourceModel();
		Kitchen kitchen = kitchenToGrid.getTargetModel();
		
		
		System.out.println("srccr model--" + grid);
		System.out.println("trgg model--" + kitchen); 
		
		Analysis analysis = new Analysis();
		UIModels uiModels = analysis.convertToUIModels(kitchen, grid);
		//analysis.setUIModels(uiModels.layout, uiModels.workspace);
		System.out.println("after analysis done inside observer"); 
		
	}
	
	public static void main(String[] args) {
	
//		ClientObservable observable = new ClientObservable();
//		AdapterObserver observer = new AdapterObserver();
//		//AdapterObserver observer = new AdapterObserver(observable);
//	    //observable.addObserver(observer);
//		observable.attach(observer);
//	            
//	    Canvas canvas = new Canvas(500, 500);	
//	    observable.setCanvas(canvas);
//	
	}

}
