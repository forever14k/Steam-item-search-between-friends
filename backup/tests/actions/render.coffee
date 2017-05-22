describe 'actions/render', () ->

  beforeEach () ->
    @testRender = new Render {}

  afterEach () ->
    @testRender = null

  describe '.diff()', () ->
    beforeEach () ->
      @oldHTML = '<div class="sisbf_test"><div class="sisbf_render--diff"><div class="sisbf_test-text">Steam item search between friends is GOOD</div></div></div>'
      @newHTML = '<div class="sisbf_test"><div class="sisbf_render--diff"><div class="sisbf_test-text sisbf_test--awesome">Steam item search between friends is AWESOME</div></div></div>'

      @$oldEl = $ @oldHTML
      @$newEl = $ @newHTML
      @testRender.diff @$oldEl, @newHTML

    afterEach () ->
      @oldHTML = null
      @newHTML = null
      @$oldEl = null
      @$newEl = null

    it 'it should not create new DOM', () ->
      expect( _.first( @$oldEl ) ).not.toBe( _.first( @$newEl ) )

    it 'id should change HTML in old DOM', () ->
      expect( @$oldEl.html() ).toBe( @$newEl.html() )
