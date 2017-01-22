package bxtooldemo.adapter.core.uiservice;

import bxtooldemo.adapter.core.implementations.emoflon.KitchenToGrid;
import bxtooldemo.adapter.uimodels.Layout;
import bxtooldemo.adapter.uimodels.UIModels;
import bxtooldemo.adapter.uimodels.Workspace;
import KitchenLanguage.Kitchen;

import java.util.List;

import GridLanguage.Grid;


public class Analysis{

	private KitchenToGrid kitchenToGrid;
	private Kitchen kitchen;
	private Grid grid;
	
	public UIModels getUIModels() {
		
		//conversion code here
		System.out.println("start getuimodels");
		this.kitchenToGrid = new KitchenToGrid(5);
		this.kitchenToGrid.initiateSynchronisationDialogue();
		System.out.println("inside getuimodels -- after init");
		
		this.grid = kitchenToGrid.getSourceModel();
		this.kitchen = kitchenToGrid.getTargetModel();
		
		
		System.out.println("srccr model--" + this.grid);
		System.out.println("trgg model--" + this.kitchen); 
		
		UIModels uiModelsAdapter = convertToUIModels(kitchen, grid);
		System.out.println("after analysis done inside getuimodels: " + uiModelsAdapter.workspace);
		
		return uiModelsAdapter;
		
	}
	
	public void setUIModels(Layout layout, Workspace workspace){
//		this.layoutAdapter = layout;
//		this.workspaceAdapter = workspace;
//		
//		System.out.println("Inside setuimodel of Adapter");
//		System.out.println("workspace after converted from tgg model: "+ this.workspaceAdapter);
	}
	
	public UIModels convertToUIModels(Kitchen kitchen, Grid grid){
		//conversion code here
		
		Layout layoutAdapter = new Layout();
		Workspace workspaceAdapter = new Workspace();
		UIModels uiModelsAdapter = new UIModels();
		
		layoutAdapter.name = "fromadapter";
		workspaceAdapter.setWidth((int) kitchen.getXSize());
		
		System.out.println(workspaceAdapter.getWidth());
		
		uiModelsAdapter.layout = layoutAdapter;
		uiModelsAdapter.workspace = workspaceAdapter;
		
		return new UIModels();
	}
	
    public void convertFromUIModels(){
		
	}
	
}
