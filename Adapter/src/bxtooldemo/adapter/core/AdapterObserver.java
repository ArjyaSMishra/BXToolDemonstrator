package bxtooldemo.adapter.core;

import java.util.Observable;
import java.util.Observer;

import GridLanguage.Grid;
import KitchenLanguage.Kitchen;
import bxtooldemo.adapter.core.implementations.emoflon.KitchenToGrid;
import bxtooldemo.adapter.core.uiservice.Analysis;
import bxtooldemo.ui.core.ClientObservable;
import bxtooldemo.ui.models.Canvas;
import bxtooldemo.ui.models.UIModels;

public class AdapterObserver implements Observer{

	protected ClientObservable clientObservable;
	public AdapterObserver(ClientObservable clientObservable){
	      this.clientObservable = clientObservable;
	      this.clientObservable.attach(this);
	   }
	
	@Override
	public void update(Observable arg0, Object arg1) {
		// TODO Auto-generated method stub
		
		KitchenToGrid kitchenToGrid = new KitchenToGrid(5);
		kitchenToGrid.initiateSynchronisationDialogue();
		
		Kitchen kitchen = kitchenToGrid.getSourceModel();
		Grid grid = kitchenToGrid.getTargetModel();
		
		System.out.println("src model--" + kitchen);
		System.out.println("trg model--" + grid); 
		
		Analysis analysis = new Analysis();
		UIModels uiModels = analysis.convertToUIModels(kitchen, grid);
		analysis.setUIModels(uiModels.layout, uiModels.workspace);
		
	}
	
	public static void main(String[] args) {
	
		ClientObservable observable = new ClientObservable();
		AdapterObserver observer = new AdapterObserver(observable);
	    observable.addObserver(observer);
	            
	    Canvas canvas = new Canvas(500, 500);	
	    observable.setCanvas(canvas);
	
	}

}
