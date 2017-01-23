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
	private UIModels uiModelsAdapter;
	
	public UIModels getUIModels() {
		
		this.kitchenToGrid = new KitchenToGrid(5);
		this.kitchenToGrid.initiateSynchronisationDialogue();
		
		this.grid = kitchenToGrid.getSourceModel();
		this.kitchen = kitchenToGrid.getTargetModel();
		
		this.uiModelsAdapter = convertToUIModels(kitchen, grid);
		
		return this.uiModelsAdapter;
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
		UIModels uiModelAdapter = new UIModels();
		
		layoutAdapter.name = "fromadapterrr";
		workspaceAdapter.setWidth((int) kitchen.getXSize());
		
		uiModelAdapter.layout = layoutAdapter;
		uiModelAdapter.workspace = workspaceAdapter;
		
		return uiModelAdapter;
	}
	
    public void convertFromUIModels(){
		
	}
	
}
