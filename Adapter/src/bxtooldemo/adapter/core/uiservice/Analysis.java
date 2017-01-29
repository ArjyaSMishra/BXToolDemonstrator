package bxtooldemo.adapter.core.uiservice;

import java.util.function.Consumer;

import org.eclipse.emf.ecore.EClass;
import org.eclipse.emf.ecore.util.EcoreUtil;

import GridLanguage.Block;
import GridLanguage.Grid;
import GridLanguage.Group;
import KitchenLanguage.Item;
import KitchenLanguage.Kitchen;
import KitchenLanguage.KitchenLanguageFactory;
import KitchenLanguage.KitchenLanguagePackage;
import KitchenLanguage.Sink;
import bxtooldemo.adapter.core.implementations.emoflon.KitchenToGrid;
import bxtooldemo.adapter.uimodels.Change;
import bxtooldemo.adapter.uimodels.Circle;
import bxtooldemo.adapter.uimodels.Layout;
import bxtooldemo.adapter.uimodels.Rectangle;
import bxtooldemo.adapter.uimodels.UIGroup;
import bxtooldemo.adapter.uimodels.UIModels;
import bxtooldemo.adapter.uimodels.Workspace;

public class Analysis {

	private KitchenToGrid kitchenToGrid;
	private Kitchen kitchen;
	private Grid grid;
	private UIModels uiModelsAdapter;
	public static int blockArrayNo;

	public void initeMoflonTool(int blockArrayNo) {

		this.kitchenToGrid = new KitchenToGrid();
		Analysis.blockArrayNo = blockArrayNo;
		this.kitchenToGrid.initiateSynchronisationDialogue();
	}

	public UIModels getUIModels() {

		this.uiModelsAdapter = convertToUIModels(this.kitchenToGrid.getTargetModel(),
				this.kitchenToGrid.getSourceModel());

		return this.uiModelsAdapter;
	}

	public UIModels convertToUIModels(Kitchen kitchen, Grid grid) {

		Layout layoutAdapter = new Layout();
		Workspace workspaceAdapter = new Workspace();
		UIModels uiModelAdapter = new UIModels();
		UIGroup uiGroup;
		Rectangle rect;

		// layout conversion
		layoutAdapter.setGridSize(grid.getBlockSize());
		if (grid != null && grid.getGroups().size() > 0) {
			for (Group group : grid.getGroups()) {
				uiGroup = new UIGroup();
				for (Block block : group.getOccupies()) {
					rect = new Rectangle();
					rect.setId("block_"+block.getXIndex()+"_"+block.getYIndex());
					uiGroup.getBlocks().add(rect);
				}
				layoutAdapter.getGroups().add(uiGroup);
			}
		}
		
		// workspace conversion
		workspaceAdapter.setWidth((int) kitchen.getXSize());
		workspaceAdapter.setHeight((int) kitchen.getYSize());

		// setting the UIModels
		uiModelAdapter.setLayout(layoutAdapter);
		uiModelAdapter.setWorkspace(workspaceAdapter);

		return uiModelAdapter;
	}

	public Consumer<Kitchen> convertDeltaToEdit(Change change) {
		Consumer<Kitchen> edit = (kitchen) -> {
		};

		if (change.getCreated() != null && change.getCreated().size() > 0) {
			for (Circle circle : change.getCreated()) {
				edit = edit.andThen((kitchen) -> {
					String type = circle.getType();
					EClass eClass = (EClass) KitchenLanguagePackage.eINSTANCE.getEClassifier(type);
					Item item = (Item) KitchenLanguageFactory.eINSTANCE.create(eClass);
					item.setId(circle.getId());
					item.setXPos(circle.getPosX());
					item.setYPos(circle.getPosY());
					kitchen.getItems().add(item);
				});
			}
		}

		if (change.getDeleted() != null & change.getDeleted().size() > 0) {
			for (Circle circle : change.getDeleted()) {
				edit.andThen((kitchen) -> {

				});
			}
		}

		return edit;
	}

	public UIModels getUIModelsAfterChange(Change change) {

		this.kitchenToGrid.performAndPropagateTargetEdit(convertDeltaToEdit(change));

		System.out.println("blocksie: " + this.kitchenToGrid.getSourceModel().getBlockSize());
		System.out.println("noofblocks: " + this.kitchenToGrid.getSourceModel().getBlocks().size());
		System.out.println("noofgroups: " + this.kitchenToGrid.getSourceModel().getGroups().size());
		System.out.println("noofitems: " + this.kitchenToGrid.getTargetModel().getItems().size());

		this.uiModelsAdapter = convertToUIModels(this.kitchenToGrid.getTargetModel(), this.kitchenToGrid.getSourceModel());

		return this.uiModelsAdapter;
	}

}
