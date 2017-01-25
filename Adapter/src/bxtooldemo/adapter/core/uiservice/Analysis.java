package bxtooldemo.adapter.core.uiservice;

import java.util.function.Consumer;

import org.eclipse.emf.ecore.EClass;
import org.eclipse.emf.ecore.util.EcoreUtil;

import GridLanguage.Grid;
import KitchenLanguage.Item;
import KitchenLanguage.Kitchen;
import KitchenLanguage.KitchenLanguageFactory;
import KitchenLanguage.KitchenLanguagePackage;
import bxtooldemo.adapter.core.implementations.emoflon.KitchenToGrid;
import bxtooldemo.adapter.uimodels.Change;
import bxtooldemo.adapter.uimodels.Circle;
import bxtooldemo.adapter.uimodels.Layout;
import bxtooldemo.adapter.uimodels.UIModels;
import bxtooldemo.adapter.uimodels.Workspace;


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
		
		this.uiModelsAdapter = convertToUIModels(this.kitchen, this.grid);
		
		return this.uiModelsAdapter;
	}
	
	public UIModels convertToUIModels(Kitchen kitchen, Grid grid){
		//conversion code here
		Layout layoutAdapter = new Layout();
		Workspace workspaceAdapter = new Workspace();
		UIModels uiModelAdapter = new UIModels();
		
		layoutAdapter.setGridSize(grid.getBlockSize());
		workspaceAdapter.setWidth((int) kitchen.getXSize());
		
		uiModelAdapter.setLayout(layoutAdapter);
		uiModelAdapter.setWorkspace(workspaceAdapter);
		
		return uiModelAdapter;
	}
	
    public Consumer<Kitchen> convertDeltaToEdit(Change change){
		Consumer<Kitchen> edit = (kitchen) -> {};
		System.out.println(change.getCreated().get(0).getType());
		System.out.println(change.getCreated().get(0).getPosX());
    	for (Circle circle : change.getCreated()) {
			edit.andThen((kitchen) -> {
				 String type = circle.getType();
				 EClass eClass = (EClass) KitchenLanguagePackage.eINSTANCE.getEClassifier(type);
				 Item item = (Item) KitchenLanguageFactory.eINSTANCE.create(eClass);
				 System.out.println(item.eClass().getName());
				 item.setId(circle.getId());
				 item.setXPos(circle.getPosX());
				 item.setYPos(circle.getPosY());
				 kitchen.getItems().add(item);
			});
		}
    	
    	return edit;
	}
    
    public UIModels getUIModelsAfterChange(Change change) {
    	System.out.println("inside getUIModelsAfterChange");
    	//this.kitchenToGrid = new KitchenToGrid(5);
    	//this.kitchenToGrid.initiateSynchronisationDialogue();
    	this.kitchenToGrid.performAndPropagateTargetEdit(convertDeltaToEdit(change));
    	
    	this.grid = kitchenToGrid.getSourceModel();
		this.kitchen = kitchenToGrid.getTargetModel();
		
		System.out.println(this.kitchen);
		System.out.println(this.grid);
		System.out.println(kitchenToGrid.getSourceModel().getBlocks().size());
		System.out.println(kitchenToGrid.getSourceModel().getGroups().size());
		
        this.uiModelsAdapter = convertToUIModels(this.kitchen, this.grid);
		
		return this.uiModelsAdapter;
    }
	
}
