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

import GridLanguage.Block;
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
		
		//for accessing jar
//		helper = new SynchronizationHelper();
//		helper.loadRulesFromJarArchive("", "");
		
		Resource r = helper.getResourceSet().createResource(URI.createURI("sourceModel"));
		//helper.setVerbose(true);
		Grid gridRoot = initialiseGrid();
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

	private Grid initialiseGrid() {
		Grid gridRoot = GridLanguageFactory.eINSTANCE.createGrid();
		gridRoot.setBlockSize(100);
		
		Block topLeft = createTopLeft(gridRoot);
		createFirstRow(gridRoot, topLeft, 5);
		createFirstCol(gridRoot, topLeft, 5);
		createInternalBlocks(gridRoot, topLeft, 5);
		
		return gridRoot;
	}

	private Block createTopLeft(Grid gridRoot) {
		Block block = GridLanguageFactory.eINSTANCE.createBlock();
		block.setXIndex(0);
		block.setYIndex(0);
		gridRoot.getBlocks().add(block);
		System.out.println("block_"+block.getXIndex()+"_"+block.getYIndex());
		
		return block;
	}

	private void createFirstRow(Grid gridRoot, Block topLeft, int noOfBlocks) {
		Block west = topLeft;
		for (int i = 1; i < noOfBlocks; i++) {
			Block block = GridLanguageFactory.eINSTANCE.createBlock();
			block.setXIndex(i);
			block.setYIndex(0);
			block.setW(west);
			gridRoot.getBlocks().add(block);
			
			west = block;
			System.out.println("block_"+block.getXIndex()+"_"+block.getYIndex());
		}
	}
	
	private void createFirstCol(Grid gridRoot, Block topLeft, int noOfBlocks) {
		Block north = topLeft;
		for (int i = 1; i < noOfBlocks; i++) {
			Block block = GridLanguageFactory.eINSTANCE.createBlock();
			block.setXIndex(0);
			block.setYIndex(i);
			block.setN(north);
			gridRoot.getBlocks().add(block);
			
			north = block;
			System.out.println("block_"+block.getXIndex()+"_"+block.getYIndex());
		}
	}
	
	private void createInternalBlocks(Grid gridRoot, Block topLeft, int noOfBlocks) {
		Block northwest = topLeft;
		Block north = northwest.getE();
		Block west = northwest.getS();
		for (int i = 1; i < noOfBlocks; i++) {
			
			for (int j = 1; j < noOfBlocks; j++) {
				Block block = GridLanguageFactory.eINSTANCE.createBlock();
				block.setXIndex(j);
				block.setYIndex(i);
				block.setNw(northwest);
				block.setN(north);
				block.setW(west);
				gridRoot.getBlocks().add(block);
				
				northwest = north;
				north = northwest.getE();
				west = block;
				System.out.println("block_"+block.getXIndex()+"_"+block.getYIndex());
			}
			
				topLeft = topLeft.getS();
				northwest = topLeft;
				north = northwest.getE();
				west = northwest.getS();
			
		}
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
