package bxtooldemo.adapter.core.implementations.emoflon;

import java.util.Collection;
import java.util.List;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.moflon.tgg.algorithm.configuration.Configurator;
import org.moflon.tgg.algorithm.configuration.RuleResult;

public class KitchenToGridConfigurator implements Configurator {
	private Function<List<String>, String> callback;

	public KitchenToGridConfigurator(Function<List<String>, String> askUserCallback) {
		callback = askUserCallback;
	}

	@Override
	public RuleResult chooseOne(Collection<RuleResult> alternatives) {
		List<String> choices = alternatives.stream()
										   .map(rr -> rr.getRule())
										   .collect(Collectors.toList());
		String chosenRule = getUsersChoice(choices);
		return alternatives.stream()
				           .filter(rr -> rr.isRule(chosenRule))
				           .findFirst()
				           .orElseThrow(() -> new IllegalStateException());
	}

	private String getUsersChoice(List<String> choices) {
		return callback.apply(choices);
	}
}
