package bxtooldemo.adapter.core.implementations.emoflon;

import java.util.Collection;

import org.moflon.tgg.algorithm.configuration.Configurator;
import org.moflon.tgg.algorithm.configuration.RuleResult;

public class KitchenToGridConfigurator implements Configurator {
	@Override
	public RuleResult chooseOne(Collection<RuleResult> alternatives) {
		// TODO Access GUI, pop up a dialogue presenting the alternatives, and return user's decision
		return Configurator.super.chooseOne(alternatives);
	}
}
