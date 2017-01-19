package bxtooldemo.ui.core.service;

import java.util.List;
import java.util.Map;

import bxtooldemo.ui.core.datastructures.Delta;
import bxtooldemo.ui.models.Layout;
import bxtooldemo.ui.models.UIModels;
import bxtooldemo.ui.models.Workspace;

public interface AdapterServiceFactory {
	
	public void setUIModels(Layout layout, Workspace workspace);
	
	public void propagateDelta(List<Delta> changes);
//	
//	public void getUIData();
	
	public void initModels();

}
