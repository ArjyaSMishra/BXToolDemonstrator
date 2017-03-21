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
import bxtooldemo.adapter.core.implementations.emoflon.KitchenToGrid;
import bxtooldemo.adapter.core.implementations.emoflon.KitchenToGridConfigurator;
import bxtooldemo.adapter.uimodels.Change;
import bxtooldemo.adapter.uimodels.Element;
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
	private Change failedSynchroChange;

	public void initeMoflonTool(int blockArrayNo) {

		this.kitchenToGrid = new KitchenToGrid();
		Analysis.blockArrayNo = blockArrayNo;
		this.kitchenToGrid.initiateSynchronisationDialogue();
		kitchenToGrid.setConfigurator(new KitchenToGridConfigurator());
	}

	public UIModels getUIModels() {

		this.uiModelsAdapter = convertToUIModels(this.kitchenToGrid.getTargetModel(),
				this.kitchenToGrid.getSourceModel(), this.failedSynchroChange);

		return this.uiModelsAdapter;
	}

	public UIModels convertToUIModels(Kitchen kitchen, Grid grid, Change failedSynchroChange) {

		Layout layoutAdapter = new Layout();
		Workspace workspaceAdapter = new Workspace();
		UIModels uiModelAdapter = new UIModels();
		UIGroup uiGroup;
		Rectangle rect;
		Element element;

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
		
		if (kitchen != null && kitchen.getItems().size() > 0) {
			
			for (Item item : kitchen.getItems()) {
					element = new Element();
					element.setId(item.getId());
					element.setPosX(item.getXPos());
					element.setPosY(item.getYPos());
					element.setType(item.eClass().getName());
					workspaceAdapter.getObjects().add(element);
			}
			System.out.println("workspace adapter item size " + workspaceAdapter.getObjects().size());
		}
		

		// setting the UIModels
		uiModelAdapter.setLayout(layoutAdapter);
		uiModelAdapter.setWorkspace(workspaceAdapter);
		uiModelAdapter.setFailedDeltas(failedSynchroChange);

		return uiModelAdapter;
	}

	public Consumer<Kitchen> convertDeltaToEdit(Change change) {
		Consumer<Kitchen> edit = (kitchen) -> {
		};

		System.out.println("create list length before edit: " + change.getCreated().size());
		if (change.getCreated() != null && change.getCreated().size() > 0) {
			for (Element element : change.getCreated()) {
				edit = edit.andThen((kitchen) -> {
					String type = element.getType();
					EClass eClass = (EClass) KitchenLanguagePackage.eINSTANCE.getEClassifier(type);
					Item item = (Item) KitchenLanguageFactory.eINSTANCE.create(eClass);
					item.setId(element.getId());
					item.setXPos(element.getPosX());
					item.setYPos(element.getPosY());
					System.out.println("item "+ item);
					kitchen.getItems().add(item);
				});
			}
		}

		System.out.println("delete list length before edit: " + change.getDeleted().size());
		if (change.getDeleted() != null && change.getDeleted().size() > 0) {
			for (Element element : change.getDeleted()) {
				edit = edit.andThen((kitchen) -> {
					Item item = kitchen.getItems().stream().filter(x -> x.getId().equals(element.getId())).findFirst().orElse(null);
					System.out.println("item "+ item);
				    EcoreUtil.delete(item);
				});
			}
		}
		
		System.out.println("moved list length before edit: " + change.getMoved().size());
		if (change.getMoved() != null && change.getMoved().size() > 0) {
			for (Element element : change.getMoved()) {
				edit = edit.andThen((kitchen) -> {
					Item item = kitchen.getItems().stream().filter(x -> x.getId().equals(element.getId())).findFirst().orElse(null);
					System.out.println("item "+ item);
					item.setXPos(element.getPosX());
					item.setYPos(element.getPosY());
				});
			}
		}

		return edit;
	}

	public UIModels getUIModelsAfterChange(Change change) {

		this.kitchenToGrid.performAndPropagateTargetEdit(convertDeltaToEdit(change));

		System.out.println("Grid blocksize: " + this.kitchenToGrid.getSourceModel().getBlockSize());
		System.out.println("Grid noofblocks: " + this.kitchenToGrid.getSourceModel().getBlocks().size());
		System.out.println("Grid noofgroups: " + this.kitchenToGrid.getSourceModel().getGroups().size());
		System.out.println("Kitchen noofitems: " + this.kitchenToGrid.getTargetModel().getItems().size());

		this.uiModelsAdapter = convertToUIModels(this.kitchenToGrid.getTargetModel(), this.kitchenToGrid.getSourceModel(), this.failedSynchroChange);

		return this.uiModelsAdapter;
	}
	
	public UIModels getUIModelsAfterAtomicDeltaPropagation(Change change) {
		Consumer<Kitchen> edit = (kitchen) -> {
		};
		
		this.failedSynchroChange = new Change();

		System.out.println("create list length before edit: " + change.getCreated().size());
		if (change.getCreated() != null && change.getCreated().size() > 0) {
			for (Element element : change.getCreated()) {
				Consumer<Kitchen> editCreate = edit.andThen((kitchen) -> {
					String type = element.getType();
					EClass eClass = (EClass) KitchenLanguagePackage.eINSTANCE.getEClassifier(type);
					Item item = (Item) KitchenLanguageFactory.eINSTANCE.create(eClass);
					item.setId(element.getId());
					item.setXPos(element.getPosX());
					item.setYPos(element.getPosY());
					System.out.println("item "+ item);
					kitchen.getItems().add(item);
				});
				try
			      {
					this.kitchenToGrid.performAndPropagateTargetEdit(editCreate);
			      } catch (Exception e)
			      {
			    	this.failedSynchroChange.getCreated().add(element);
			      }
			}
		}

		System.out.println("delete list length before edit: " + change.getDeleted().size());
		if (change.getDeleted() != null && change.getDeleted().size() > 0) {
			for (Element element : change.getDeleted()) {
				Consumer<Kitchen> editDelete = edit.andThen((kitchen) -> {
					Item item = kitchen.getItems().stream().filter(x -> x.getId().equals(element.getId())).findFirst().orElse(null);
					System.out.println("item "+ item);
				    EcoreUtil.delete(item);
				});
				try
			      {
					this.kitchenToGrid.performAndPropagateTargetEdit(editDelete);
			      } catch (Exception e)
			      {
			    	  this.failedSynchroChange.getDeleted().add(element);
			      }
			}
		}
		
		System.out.println("moved list length before edit: " + change.getMoved().size());
		if (change.getMoved() != null && change.getMoved().size() > 0) {
			for (Element element : change.getMoved()) {
				Consumer<Kitchen> editMoved = edit.andThen((kitchen) -> {
					Item item = kitchen.getItems().stream().filter(x -> x.getId().equals(element.getId())).findFirst().orElse(null);
					System.out.println("item "+ item);
					item.setXPos(element.getPosX());
					item.setYPos(element.getPosY());
				});
				try
			      {
					this.kitchenToGrid.performAndPropagateTargetEdit(editMoved);
			      } catch (Exception e)
			      {
			    	  this.failedSynchroChange.getMoved().add(element);
			      }		
			}
		}

		this.uiModelsAdapter = convertToUIModels(this.kitchenToGrid.getTargetModel(), this.kitchenToGrid.getSourceModel(), this.failedSynchroChange);
		
		return this.uiModelsAdapter;
	}

}
