package bxtooldemo.adapter.core.implementations.emoflon;

import org.eclipse.emf.ecore.EPackage;
import org.eclipse.emf.ecore.util.EcoreUtil;
import org.moflon.core.utilities.eMoflonEMFUtil;
import org.moflon.tgg.algorithm.configuration.Configurator;
import org.moflon.tgg.algorithm.synchronization.SynchronizationHelper;
import KitchenToGridLanguage.KitchenToGridLanguagePackage;

public class KitchenToGridSynchronizationHelper extends SynchronizationHelper {
	public KitchenToGridSynchronizationHelper(String location) {
		this.set = eMoflonEMFUtil.createDefaultResourceSet();
		EPackage corrPackage = KitchenToGridLanguagePackage.eINSTANCE;
		projectName = corrPackage.getName();

		// Set mapping for correspondence package to ecore file
		corrPackageResource = corrPackage.eResource();

		configurator = new Configurator() {
		};
		changeSrc = (root -> {
		});
		changeTrg = (root -> {
		});

		loadRulesFromJarArchive(location, "/KitchenToGridLanguage.sma.xmi");
		EcoreUtil.resolveAll(rules);
	}
}
