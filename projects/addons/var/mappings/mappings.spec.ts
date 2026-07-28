/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { getInputMappings, In, InputMappings } from './input-mapping';
import { Mappings } from './mappings';
import { getOutputMappings, Out, OutputMappings } from './output-mapping';

class StepModel {
  @In() var1 = '';

  @Out() var2 = '';
}

class ExtendedStepModel extends StepModel {
  @In() eVar1 = 1;

  @Out() eVar2 = '';
}

class StepModel2 {
  var3 = '';
  var4 = '';
}

class WizardModel {
  prop1 = '';
  prop2 = '';
  prop3 = 0;
  prop4 = '';
}

interface ThisTest {
  stepModel: StepModel;
  wizardModel: WizardModel;
  inputMappings: InputMappings;
  outputMappings: OutputMappings;
}

describe('Mappings', () => {
  beforeEach(function (this: ThisTest) {
    this.stepModel = new StepModel();
    this.inputMappings = getInputMappings(this.stepModel);
    this.outputMappings = getOutputMappings(this.stepModel);
  });

  describe('when step model class extends another step model', () => {
    beforeEach(function (this: ThisTest) {
      this.stepModel = new ExtendedStepModel();
      this.inputMappings = getInputMappings(this.stepModel);
      this.outputMappings = getOutputMappings(this.stepModel);
    });

    it('input mapping of own properties should work', function (this: ThisTest) {
      expect(this.inputMappings['eVar1'].propertyName).toEqual('eVar1');
    });

    it('input mapping of parent properties should work', function (this: ThisTest) {
      expect(this.inputMappings['var1'].propertyName).toEqual('var1');
    });

    it('output mapping of own properties should work', function (this: ThisTest) {
      expect(this.outputMappings['eVar2'].propertyName).toEqual('eVar2');
    });

    it('output mapping of parent properties should work', function (this: ThisTest) {
      expect(this.outputMappings['var2'].propertyName).toEqual('var2');
    });
  });

  it('input mapping var1 should be mapped to var1', function (this: ThisTest) {
    expect(this.inputMappings['var1'].propertyName).toEqual('var1');
  });

  it('output mapping var2 should be mapped to var2', function (this: ThisTest) {
    expect(this.outputMappings['var2'].propertyName).toEqual('var2');
  });

  it('if there are no @in or @out for mappings mentioned, then it should throw error', function () {
    const mappings = new Mappings<StepModel2, WizardModel>()
      .mapStepProp('var3')
      .to('prop1')
      .mapStepProp('var4')
      .to('prop2');
    try {
      mappings.validate(new StepModel2());
      fail('should never reach here');
    } catch (e) {
      expect((e as Error).message).toEqual(`No @In or @Out decorator found for property names ["var3","var4"]`);
    }
  });

  it('throws error, if mapping is defined more than once for same step model property ', function () {
    try {
      new Mappings<StepModel, WizardModel>().mapStepProp('var1').to('prop1').mapStepProp('var1').to('prop2');
      fail('should never reach here');
    } catch (e) {
      expect((e as Error).message).toEqual(`A mapping for property var1 is defined more than once.`);
    }
  });

  it('throws error, if mapping is defined more than once for same wizard model property ', function () {
    try {
      new Mappings<StepModel, WizardModel>().mapStepProp('var1').to('prop1').mapStepProp('var2').to('prop1');
      fail('should never reach here');
    } catch (e) {
      expect((e as Error).message).toEqual(`A mapping for property prop1 is defined more than once.`);
    }
  });
});
