package bxtooldemo.adapter.core.uiservice;

import bxtooldemo.adapter.core.implementations.emoflon.KitchenToGrid;
import bxtooldemo.ui.core.datastructures.Delta;
import bxtooldemo.ui.core.service.AdapterService;
import bxtooldemo.ui.models.Layout;
import bxtooldemo.ui.models.UIModels;
import bxtooldemo.ui.models.Workspace;
import KitchenLanguage.Kitchen;

import java.util.List;

import GridLanguage.Grid;


public class Analysis extends AdapterService{

	private KitchenToGrid kitchenToGrid;
	private Layout layoutAdapter;
	private Workspace workspaceAdapter;
	private UIModels uiModelsAdapter;
	

	@Override
	public void propagateDelta(List<Delta> changes) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void initModels() {
		// TODO Auto-generated method stub
		
		kitchenToGrid = new KitchenToGrid(5);
		kitchenToGrid.initiateSynchronisationDialogue();
		
	}
	
	public void getUIModels() {
		// TODO Auto-generated method stub
		
		//conversion code here
		Kitchen kitchen = kitchenToGrid.getSourceModel();
		Grid grid = kitchenToGrid.getTargetModel();
		UIModels uiModels = convertToUIModels(kitchen, grid);
		
		setUIModels(uiModels.layout, uiModels.workspace);
		
	}
	
	public UIModels convertToUIModels(Kitchen kitchen, Grid grid){
		//conversion code here
		
		layoutAdapter = new Layout();
		workspaceAdapter = new Workspace();
		uiModelsAdapter = new UIModels();
		
		layoutAdapter.name = "fromadapter";
		
		uiModelsAdapter.layout = layoutAdapter;
		uiModelsAdapter.workspace = workspaceAdapter;
		
		return new UIModels();
	}
	
    public void convertFromUIModels(){
		
	}
	
}
