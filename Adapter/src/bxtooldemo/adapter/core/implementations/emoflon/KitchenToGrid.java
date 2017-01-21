package bxtooldemo.adapter.core.implementations.emoflon;

import java.io.File;
import java.util.function.Consumer;

import org.apache.log4j.BasicConfigurator;
import org.benchmarx.BXToolForEMF;
import org.benchmarx.Comparator;
import org.benchmarx.Configurator;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.ecore.EObject;
import org.eclipse.emf.ecore.resource.Resource;
import org.moflon.tgg.algorithm.synchronization.SynchronizationHelper;

import GridLanguage.Grid;
import GridLanguage.GridLanguageFactory;
import KitchenLanguage.Kitchen;
import KitchenToGridLanguage.KitchenToGridLanguagePackage;
import bxtooldemo.adapter.models.Decisions;

public class KitchenToGrid extends BXToolForEMF<Grid, Kitchen, Decisions> {
	
	public KitchenToGrid(Comparator<Grid> src, Comparator<Kitchen> trg) {
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
		
		BasicConfigurator.configure();
		System.out.println(new File("KitchenToGridLanguage").getAbsolutePath());
		helper = new SynchronizationHelper(KitchenToGridLanguagePackage.eINSTANCE, "C:/Users/Arjya Shankar Mishra/git/eMoflon-Rules/KitchenToGridLanguage");
		Resource r = helper.getResourceSet().createResource(URI.createURI("sourceModel"));
		Grid gridRoot = GridLanguageFactory.eINSTANCE.createGrid();
		gridRoot.setBlockSize(100);
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
	public void performAndPropagateTargetEdit(Consumer<Kitchen> edit) {
		
		helper.setChangeTrg((EObject root) ->  edit.accept((Kitchen) root));
		helper.integrateBackward();
		
	}

	@Override
	public void performAndPropagateSourceEdit(Consumer<Grid> edit) {
		
		helper.setChangeSrc((EObject root) ->  edit.accept((Grid) root));
		helper.integrateForward();
		
	}

	@Override
	public void setConfigurator(Configurator<Decisions> configurator) {
		// No configuration at the moment
	}

	@Override
	public Grid getSourceModel() {
		return (Grid) helper.getSrc();
	}

	@Override
	public Kitchen getTargetModel() {
		return (Kitchen) helper.getTrg();
	}
	

}
