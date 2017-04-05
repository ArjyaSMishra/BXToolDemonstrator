package bxtooldemo.adapter.core.uiservice;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.function.Consumer;

import org.eclipse.emf.ecore.EClass;
import org.eclipse.emf.ecore.EObject;
import org.eclipse.emf.ecore.util.EcoreUtil;
import org.eclipse.emf.ecore.util.EcoreUtil.Copier;

import GridLanguage.Block;
import GridLanguage.Grid;
import GridLanguage.GridLanguageFactory;
import GridLanguage.GridLanguagePackage;
import GridLanguage.Group;
import KitchenLanguage.Item;
import KitchenLanguage.ItemSocket;
import KitchenLanguage.Kitchen;
import KitchenLanguage.KitchenLanguageFactory;
import KitchenLanguage.KitchenLanguagePackage;
import bxtooldemo.adapter.core.implementations.emoflon.KitchenToGrid;
import bxtooldemo.adapter.core.implementations.emoflon.KitchenToGridConfigurator;
import bxtooldemo.adapter.core.implementations.emoflon.SynchronisationFailedException;
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
	private Map<Integer, String> groupColors = new HashMap();

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
					uiGroup.setFillColor(getColorForGroup(group));
					uiGroup.getBlocks().add(rect);
				}
				layoutAdapter.getGroups().add(uiGroup);
			}
		}
		
		// workspace conversion
		workspaceAdapter.setWidth((int) kitchen.getXSize());
		workspaceAdapter.setHeight((int) kitchen.getYSize());
		
		if (kitchen != null && kitchen.getItemSockets().size() > 0) {
			
			for (ItemSocket itemSocket : kitchen.getItemSockets()) {
				System.out.println("item id: "+ itemSocket.getId());
				if(itemSocket.getItem()!=null){
					element = new Element();
					System.out.println("item type: "+ itemSocket.getItem().eClass().getName());
					element.setId(itemSocket.getId());
					element.setPosX(itemSocket.getItem().getXPos());
					element.setPosY(itemSocket.getItem().getYPos());
					element.setType(itemSocket.getItem().eClass().getName());
					workspaceAdapter.getObjects().add(element);
				}
			}
			System.out.println("workspace adapter item size " + workspaceAdapter.getObjects().size());
		}
		

		// setting the UIModels
		uiModelAdapter.setLayout(layoutAdapter);
		uiModelAdapter.setWorkspace(workspaceAdapter);
		uiModelAdapter.setFailedDeltas(failedSynchroChange);

		return uiModelAdapter;
	}
	
	public String getColorForGroup(Group group){
		String color = null;
		
		for (Map.Entry<Integer, String> entry : this.groupColors.entrySet()){
			if(group.hashCode() == entry.getKey()){
				return entry.getValue();
			}
		}
		
		Random random = new Random();
        // create a big random number - maximum is ffffff (hex) = 16777215 (dez)
        int nextInt = random.nextInt(256*256*256);
        // format it as hexadecimal string (with hashtag and leading zeros)
        color = String.format("#%06x", nextInt);
		this.groupColors.put(group.hashCode(), color );
		
		return color;
	}
	
	public void refreshOldMapping(Copier objectMapping){
		String color = null;
		Map<Integer, String> groupColors_new = new HashMap();
		
		for (Map.Entry<Integer, String> currentMapping : this.groupColors.entrySet()){
			for (Map.Entry<EObject, EObject> entry : objectMapping.entrySet()){
				if(currentMapping.getKey() == entry.getKey().hashCode()){
					groupColors_new.put(entry.getValue().hashCode(),currentMapping.getValue());
				}
			}
		}
		
		this.groupColors.clear();
		this.groupColors = groupColors_new;
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
					ItemSocket itemSocket = KitchenLanguageFactory.eINSTANCE.createItemSocket();
					Item item = (Item) KitchenLanguageFactory.eINSTANCE.create(eClass);
					itemSocket.setId(element.getId());
					item.setXPos(element.getPosX());
					item.setYPos(element.getPosY());
					System.out.println("item "+ item);
					itemSocket.setItem(item);;
					kitchen.getItemSockets().add(itemSocket);
				});
			}
		}

		System.out.println("delete list length before edit: " + change.getDeleted().size());
		if (change.getDeleted() != null && change.getDeleted().size() > 0) {
			for (Element element : change.getDeleted()) {
				edit = edit.andThen((kitchen) -> {
					ItemSocket itemSocket =  kitchen.getItemSockets().stream().filter(x -> x.getId().equals(element.getId())).findFirst().orElse(null);
					System.out.println("item "+ itemSocket);
				    EcoreUtil.delete(itemSocket);
				});
			}
		}
		
		System.out.println("moved list length before edit: " + change.getMoved().size());
		if (change.getMoved() != null && change.getMoved().size() > 0) {
			for (Element element : change.getMoved()) {
				edit = edit.andThen((kitchen) -> {
					ItemSocket itemSocket = kitchen.getItemSockets().stream().filter(x -> x.getId().equals(element.getId())).findFirst().orElse(null);
					System.out.println("item "+ itemSocket);
					itemSocket.getItem().setXPos(element.getPosX());
					itemSocket.getItem().setYPos(element.getPosY());
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
		System.out.println("Kitchen noofitems: " + this.kitchenToGrid.getTargetModel().getItemSockets().size());

		this.uiModelsAdapter = convertToUIModels(this.kitchenToGrid.getTargetModel(), this.kitchenToGrid.getSourceModel(), this.failedSynchroChange);

		return this.uiModelsAdapter;
	}
	
	public UIModels getUIModelsAfterAtomicDeltaPropagation(Change change) {
		Consumer<Kitchen> kitchenEdit = (kitchen) -> {
		};
		
		Consumer<Grid> gridEdit = (grid) -> {
		};
		
		this.failedSynchroChange = new Change();

		System.out.println("create list length before edit: " + change.getCreated().size());
		if (change.getCreated() != null && change.getCreated().size() > 0) {
			for (Element element : change.getCreated()) {
				Consumer<Kitchen> editCreate = kitchenEdit.andThen((kitchen) -> {
					String type = element.getType();
					EClass eClass = (EClass) KitchenLanguagePackage.eINSTANCE.getEClassifier(type);
					ItemSocket itemSocket = KitchenLanguageFactory.eINSTANCE.createItemSocket();
					Item item = (Item) KitchenLanguageFactory.eINSTANCE.create(eClass);
					itemSocket.setId(element.getId());
					item.setXPos(element.getPosX());
					item.setYPos(element.getPosY());
					System.out.println("item "+ item);
					itemSocket.setItem(item);
					kitchen.getItemSockets().add(itemSocket);
				});
				try
			      {
					this.kitchenToGrid.performAndPropagateTargetEdit(editCreate);
			      } catch (SynchronisationFailedException e)
			      {
			    	refreshOldMapping(e.getObjectMapping());
			    	this.failedSynchroChange.getCreated().add(element);
			      }
			}
		}

		System.out.println("delete list length before edit: " + change.getDeleted().size());
		if (change.getDeleted() != null && change.getDeleted().size() > 0) {
			for (Element element : change.getDeleted()) {
				Consumer<Kitchen> editDelete = kitchenEdit.andThen((kitchen) -> {
					ItemSocket itemSocket =  kitchen.getItemSockets().stream().filter(x -> x.getId().equals(element.getId())).findFirst().orElse(null);
					System.out.println("item "+ itemSocket);
				    EcoreUtil.delete(itemSocket);
				});
				try
			      {
					this.kitchenToGrid.performAndPropagateTargetEdit(editDelete);
			      } catch (SynchronisationFailedException e)
			      {
			    	  refreshOldMapping(e.getObjectMapping());
			    	  this.failedSynchroChange.getDeleted().add(element);
			      }
			}
		}
		
		System.out.println("moved list length before edit: " + change.getMoved().size());
		if (change.getMoved() != null && change.getMoved().size() > 0) {
			for (Element element : change.getMoved()) {
				Consumer<Kitchen> editMoved = kitchenEdit.andThen((kitchen) -> {
					ItemSocket itemSocket = kitchen.getItemSockets().stream().filter(x -> x.getId().equals(element.getId())).findFirst().orElse(null);
					System.out.println("item "+ itemSocket);
					itemSocket.getItem().setXPos(element.getPosX());
					itemSocket.getItem().setYPos(element.getPosY());
				});
				try
			      {
					this.kitchenToGrid.performAndPropagateTargetEdit(editMoved);
			      } catch (SynchronisationFailedException e)
			      {
			    	  refreshOldMapping(e.getObjectMapping());
			    	  this.failedSynchroChange.getMoved().add(element);
			      }		
			}
		}
		
		System.out.println("create group list length before edit: " + change.getGroupCreated().size());
		if (change.getGroupCreated() != null && change.getGroupCreated().size() > 0) {
			for (UIGroup uiGroup : change.getGroupCreated()) {
				Consumer<Grid> editGroupCreated = gridEdit.andThen((grid) -> {
					Group group = (Group) GridLanguageFactory.eINSTANCE.createGroup();
					System.out.println("group "+ group);
					for(Rectangle rect : uiGroup.getBlocks()){
						Block block = grid.getBlocks().stream().filter(x -> x.getXIndex() == rect.getxIndex() && x.getYIndex() == rect.getyIndex()).findFirst().orElse(null);
						group.getOccupies().add(block);
					}
					grid.getGroups().add(group);
				});
				try
			      {
					this.kitchenToGrid.performAndPropagateSourceEdit(editGroupCreated);
			      } catch (SynchronisationFailedException e)
			      {
			    	refreshOldMapping(e.getObjectMapping());
			    	//this.failedSynchroChange.getCreated().add(element);
			      }	
			}
		}
		
		System.out.println("delete group list length before edit: " + change.getGroupDeleted().size());
		if (change.getGroupDeleted() != null && change.getGroupDeleted().size() > 0) {
			for (UIGroup uiGroup : change.getGroupDeleted()) {
				Consumer<Grid> editGroupDeleted = gridEdit.andThen((grid) -> {
					Group matchGroup = null;
					out:
					for (Group group : grid.getGroups()){
						for (Block block : group.getOccupies()){
							if (block.getXIndex() == uiGroup.getBlocks().get(0).getxIndex() && block.getYIndex() == uiGroup.getBlocks().get(0).getyIndex()){
								matchGroup = group;
								break out;
							}
						}
					}
//					Group group =  grid.getGroups().stream().filter(x -> x.getOccupies().get(0).getXIndex() == (uiGroup.getBlocks().get(0).getxIndex())) 
//							.filter(x -> x.getOccupies().get(0).getYIndex() == (uiGroup.getBlocks().get(0).getyIndex()))
//						.findFirst().orElse(null);
					System.out.println("group "+ matchGroup);
				    EcoreUtil.delete(matchGroup);
				});
				try
			      {
					this.kitchenToGrid.performAndPropagateSourceEdit(editGroupDeleted);
			      } catch (SynchronisationFailedException e)
			      {
			    	refreshOldMapping(e.getObjectMapping());
//			    	this.failedSynchroChange.getCreated().add(element);
			      }	
			}
		}
		
		System.out.println("Grid blocksize: " + this.kitchenToGrid.getSourceModel().getBlockSize());
		System.out.println("Grid noofblocks: " + this.kitchenToGrid.getSourceModel().getBlocks().size());
		System.out.println("Grid noofgroups: " + this.kitchenToGrid.getSourceModel().getGroups().size());
		System.out.println("Kitchen noofsockets: " + this.kitchenToGrid.getTargetModel().getItemSockets().size());
		this.uiModelsAdapter = convertToUIModels(this.kitchenToGrid.getTargetModel(), this.kitchenToGrid.getSourceModel(), this.failedSynchroChange);
		
		return this.uiModelsAdapter;
	}

}
