describe 'reducers/tags/common', () ->
  describe '._cleanDefinition()', () ->
    beforeEach () ->
      @cleanDefinition = TagsCommonReducer::cleanDefinition
      TagsCommonReducer::cleanDefinition = __mock__( 'tags/common/function/cleanDefinition/unsorted' )

    afterEach () ->
      TagsCommonReducer::cleanDefinition = @cleanDefinition

    it 'it should sort .cleanDefinition[]', () ->
      cleanDefinition = __mock__( 'tags/common/function/cleanDefinition/sorted' )

      TagsCommonReducer::_cleanDefinition()
      expect( TagsCommonReducer::cleanDefinition ).toEqual( cleanDefinition )

  describe '.tagCommonColor()', () ->
    beforeEach () ->
      @colorOrder = TagsCommonReducer::colorOrder
      TagsCommonReducer::colorOrder = __mock__( 'tags/common/function/tagCommonColor/order' )
      @colorExclude = TagsCommonReducer::colorExclude
      TagsCommonReducer::colorExclude = __mock__( 'tags/common/function/tagCommonColor/exclude' )

    afterEach () ->
      TagsCommonReducer::colorOrder = @colorOrder
      TagsCommonReducer::colorExclude = @colorExclude

    it 'it should determine item color through tags by .colorOrder', () ->
      description = __mock__( 'tags/common/description/tags/color/CF6A32' )

      TagsCommonReducer::tagCommonColor description
      expect( description._sisbftags ).toContain jasmine.objectContaining
        category_name: OPTION_COLOR
        color: 'CF6A32'

    it 'it should exclude .colorExclude', () ->
      description = __mock__( 'tags/common/description/tags/color/5e98d9' )

      TagsCommonReducer::tagCommonColor description
      expect( description._sisbftags ).toContain jasmine.objectContaining
        category_name: OPTION_COLOR
        color: '5e98d9'

  describe '.tagCommonTradable()', () ->
    describe 'it should determine is item', () ->
      it 'tradable', () ->
        description = __mock__( 'tags/common/description/tradable/true' )

        TagsCommonReducer::tagCommonTradable description
        expect( description._sisbftags ).toContain jasmine.objectContaining
          category_name: OPTION_TRADABLE
          name: CHOICE_TRADABLE

      it 'not tradable', () ->
        description = __mock__( 'tags/common/description/tradable/false' )

        TagsCommonReducer::tagCommonTradable description
        expect( description._sisbftags ).toContain jasmine.objectContaining
          category_name: OPTION_TRADABLE
          name: CHOICE_NOTTRADABLE

  describe '.tagCommonMarketable()', () ->
    describe 'it should determine is item', () ->
      it 'marketable', () ->
        description = __mock__( 'tags/common/description/marketable/true' )

        TagsCommonReducer::tagCommonMarketable description
        expect( description._sisbftags ).toContain jasmine.objectContaining
          category_name: OPTION_MARKETABLE
          name: CHOICE_MARKETABLE

      it 'not marketable', () ->
        description = __mock__( 'tags/common/description/marketable/false' )

        TagsCommonReducer::tagCommonMarketable description
        expect( description._sisbftags ).toContain jasmine.objectContaining
          category_name: OPTION_MARKETABLE
          name: CHOICE_NOTMARKETABLE

  describe '.tagCommonChangedName()', () ->
    describe 'it should determine is item with', () ->
      it 'changed name', () ->
        description = __mock__( 'tags/common/description/name/changed/true' )

        TagsCommonReducer::tagCommonChangedName description
        expect( description._sisbftags ).toContain jasmine.objectContaining
          category_name: OPTION_CHANGED_NAME
          name: CHOICE_CHANGED_NAME

      it 'not changed name', () ->
        description = __mock__( 'tags/common/description/name/changed/false' )

        TagsCommonReducer::tagCommonChangedName description
        expect( description._sisbftags ).toContain jasmine.objectContaining
          category_name: OPTION_CHANGED_NAME
          name: CHOICE_NOTCHANGED_NAME

  describe '.tagCommonNameTag()', () ->
    describe 'it should determine is item with', () ->
      it 'changed name', () ->
        description = __mock__( 'tags/common/description/fraudwarnings/name/changed/true' )

        TagsCommonReducer::tagCommonNameTag description
        expect( description._sisbftags ).toContain jasmine.objectContaining
          category_name: OPTION_CHANGED_NAME
          name: CHOICE_CHANGED_NAME

      it 'not changed name', () ->
        description = __mock__( 'tags/common/description/fraudwarnings/name/changed/false' )

        TagsCommonReducer::tagCommonNameTag description
        expect( description._sisbftags ).toContain jasmine.objectContaining
          category_name: OPTION_CHANGED_NAME
          name: CHOICE_NOTCHANGED_NAME

  describe '.tagCommonChangedDescripion()', () ->
    describe 'it should determine is item with', () ->
      it 'changed description', () ->
        description = __mock__( 'tags/common/description/descriptions/name/changed/true' )

        TagsCommonReducer::tagCommonChangedDescripion description
        expect( description._sisbftags ).toContain jasmine.objectContaining
          category_name: OPTION_CHANGED_DESCRIPTION
          name: CHOICE_CHANGED_DESCRIPTION

      it 'not changed description', () ->
        description = __mock__( 'tags/common/description/descriptions/name/changed/false' )

        TagsCommonReducer::tagCommonChangedDescripion description
        expect( description._sisbftags ).toContain jasmine.objectContaining
          category_name: OPTION_CHANGED_DESCRIPTION
          name: CHOICE_NOTCHANGED_DESCRIPTION

  describe '.tagCommonGifted()', () ->
    describe 'it should determine is item', () ->
      it 'gifted', () ->
        description = __mock__( 'tags/common/description/descriptions/gifted/true' )

        TagsCommonReducer::tagCommonGifted description
        expect( description._sisbftags ).toContain jasmine.objectContaining
          category_name: OPTION_GIFTED
          name: CHOICE_GIFTED

      it 'not gifted', () ->
        description = __mock__( 'tags/common/description/descriptions/gifted/false' )

        TagsCommonReducer::tagCommonGifted description
        expect( description._sisbftags ).toContain jasmine.objectContaining
          category_name: OPTION_GIFTED
          name: CHOICE_NOTGIFTED

  describe '.tagCommonCrafted()', () ->
    describe 'it should determine is item', () ->
      it 'crafted', () ->
        description = __mock__( 'tags/common/description/descriptions/crafted/true' )

        TagsCommonReducer::tagCommonCrafted description
        expect( description._sisbftags ).toContain jasmine.objectContaining
          category_name: OPTION_CRAFTED
          name: CHOICE_CRAFTED

      it 'not crafted', () ->
        description = __mock__( 'tags/common/description/descriptions/crafted/false' )

        TagsCommonReducer::tagCommonCrafted description
        expect( description._sisbftags ).toContain jasmine.objectContaining
          category_name: OPTION_CRAFTED
          name: CHOICE_NOTCRAFTED


  describe '.tagCommonClean()', () ->

    beforeEach () ->
      @cleanDefinition = TagsCommonReducer::cleanDefinition
      TagsCommonReducer::cleanDefinition = __mock__( 'tags/common/function/cleanDefinition/sorted' )

    afterEach () ->
      TagsCommonReducer::cleanDefinition = @cleanDefinition

    describe 'it should determine is item', () ->
      it 'clean', () ->
        description = __mock__( 'tags/common/description/_sisbftags/clean/true' )

        TagsCommonReducer::tagCommonClean description
        expect( description._sisbftags ).toContain jasmine.objectContaining
          category_name: OPTION_CLEAN
          name: CHOICE_CLEAN

      it 'dirty', () ->
        description = __mock__( 'tags/common/description/_sisbftags/clean/false' )

        TagsCommonReducer::tagCommonClean description
        expect( description._sisbftags ).toContain jasmine.objectContaining
          category_name: OPTION_CLEAN
          name: CHOICE_DIRTY

  describe '.tagCommonDescItemSetName()', () ->
    it 'it should determine is item part of set', () ->
      description = __mock__( 'tags/common/description/descriptions/set/ardor of the scarlet raven' )

      TagsCommonReducer::tagCommonDescItemSetName description
      expect( description._sisbftags ).toContain jasmine.objectContaining
        category_name: OPTION_ITEMSET
        name: 'Ardor of the scarlet raven'

  describe '.tagCommonDescStyle()', () ->
    it 'it should determine is item have style', () ->
      description = __mock__( 'tags/common/description/descriptions/style/menacing' )

      TagsCommonReducer::tagCommonDescStyle description
      expect( description._sisbftags ).toContain jasmine.objectContaining
        category_name: OPTION_STYLE
        name: 'Menacing'

  describe '.tagCommonDescDedication()', () ->
    it 'it should determine is have dedication', () ->
      description = __mock__( 'tags/common/description/descriptions/dedication/what are thooooose' )

      TagsCommonReducer::tagCommonDescDedication description
      expect( description._sisbftags ).toContain jasmine.objectContaining
        category_name: OPTION_DEDICATION
        name: 'What are thooooose'

  describe '.constructor()', () ->
    beforeEach () ->
      spyOn TagsCommonReducer::, '_cleanDefinition'
        .and
        .callThrough()
      spyOn TagsCommonReducer::, 'reducer'
        .and
        .callThrough()
      @testTagsCommonReducer = new TagsCommonReducer

    afterEach () ->
      @testTagsCommonReducer = null

    it 'it should sort .cleanDefinition[]', () ->
      expect( TagsCommonReducer::_cleanDefinition ).toHaveBeenCalled()

    it 'it should return .reducer()', () ->
      mockAction = __mock__( 'common/action/test' )

      @testTagsCommonReducer undefined, mockAction
      expect( TagsCommonReducer::reducer ).toHaveBeenCalledWith undefined, mockAction
