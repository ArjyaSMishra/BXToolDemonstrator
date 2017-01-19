package bxtooldemo.adapter.core.implementations.emoflon;

import java.util.function.Consumer;

import org.apache.log4j.BasicConfigurator;
import org.benchmarx.BXToolForEMF;
import org.benchmarx.Comparator;
import org.benchmarx.Configurator;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.ecore.EObject;
import org.eclipse.emf.ecore.resource.Resource;
import org.moflon.tgg.algorithm.synchronization.SynchronizationHelper;
import bxtooldemo.adapter.models.Decisions;

import KitchenLanguage.Kitchen;
import KitchenLanguage.KitchenLanguageFactory;
import KitchenToGridLanguage.KitchenToGridLanguagePackage;
import GridLanguage.Grid;
import GridLanguage.GridLanguageFactory;

public class KitchenToGrid extends BXToolForEMF<Kitchen, Grid, Decisions> {
	
	public KitchenToGrid(Comparator<Kitchen> src, Comparator<Grid> trg) {
		super(src, trg);
	}
	
	public KitchenToGrid(int noofGrid) {
		super(null, null);
	}
	
	private SynchronizationHelper helper;

	@Override
	public String getName() {
		return "eMoflon";
	}

	@Override
	public void initiateSynchronisationDialogue() {
		// TODO Auto-generated method stub
		BasicConfigurator.configure();
		helper = new SynchronizationHelper(KitchenToGridLanguagePackage.eINSTANCE, "../../eMoflon-Rules/KitchenToGridLanguage");
		Resource r = helper.getResourceSet().createResource(URI.createURI("sourceModel"));
		Kitchen gridRoot = KitchenLanguageFactory.eINSTANCE.createKitchen();
		r.getContents().add(gridRoot);
		
		// Fix default preferences (which can be overwritten)
//		setConfigurator(new Configurator<Decisions>()
//				.makeDecision(Decisions.PREFER_CREATING_PARENT_TO_CHILD, true)
//			    .makeDecision(Decisions.PREFER_EXISTING_FAMILY_TO_NEW, true));
		
		// perform batch to establish consistent starting state
		helper.setSrc(gridRoot);
		helper.integrateForward();	
		
		helper.setMute(true);
		
	}

	@Override
	public void performAndPropagateTargetEdit(Consumer<Grid> edit) {
		// TODO Auto-generated method stub
		helper.setChangeTrg((EObject root) ->  edit.accept((Grid) root));
		helper.integrateBackward();
		
	}

	@Override
	public void performAndPropagateSourceEdit(Consumer<Kitchen> edit) {
		// TODO Auto-generated method stub
		helper.setChangeSrc((EObject root) ->  edit.accept((Kitchen) root));
		helper.integrateForward();
		
	}

	@Override
	public void setConfigurator(Configurator<Decisions> configurator) {
		// No configuration at the moment
	}

	@Override
	public Kitchen getSourceModel() {
		return (Kitchen) helper.getSrc();
	}

	@Override
	public Grid getTargetModel() {
		return (Grid) helper.getTrg();
	}
	

}
