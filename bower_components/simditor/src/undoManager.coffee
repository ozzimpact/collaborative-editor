
class UndoManager extends SimpleModule

  @pluginName: 'UndoManager'

  _index: -1

  _capacity: 50

  _timer: null

  _init: ->
    @editor = @_module
    @_stack = []

    if @editor.util.os.mac
      undoShortcut = 'cmd+z'
      redoShortcut = 'shift+cmd+z'
    else if @editor.util.os.win
      undoShortcut = 'ctrl+z'
      redoShortcut = 'ctrl+y'
    else
      undoShortcut = 'ctrl+z'
      redoShortcut = 'shift+ctrl+z'


    @editor.inputManager.addShortcut undoShortcut, (e) =>
      e.preventDefault()
      @undo()
      false

    @editor.inputManager.addShortcut redoShortcut, (e) =>
      e.preventDefault()
      @redo()
      false

    @editor.on 'valuechanged', (e, src) =>
      return if src == 'undo'

      if @_timer
        clearTimeout @_timer
        @_timer = null

      @_timer = setTimeout =>
        @_pushUndoState()
        @_timer = null
      , 200

  _pushUndoState: ->
    return if @editor.triggerHandler('pushundostate') == false

    currentState = @currentState()
    html = @editor.body.html()
    return if currentState and currentState.html == html

    @_index += 1
    @_stack.length = @_index

    @_stack.push
      html: html
      caret: @caretPosition()

    if @_stack.length > @_capacity
      @_stack.shift()
      @_index -= 1

  currentState: ->
    if @_stack.length and @_index > -1
      @_stack[@_index]
    else
      null

  undo: ->
    return if @_index < 1 or @_stack.length < 2

    @editor.hidePopover()

    @_index -= 1

    state = @_stack[@_index]
    @editor.body.html state.html
    @caretPosition state.caret
    @editor.body.find('.selected').removeClass('selected')
    @editor.sync()

    @editor.trigger 'valuechanged', ['undo']

  redo: ->
    return if @_index < 0 or @_stack.length < @_index + 2

    @editor.hidePopover()

    @_index += 1

    state = @_stack[@_index]
    @editor.body.html state.html
    @caretPosition state.caret
    @editor.body.find('.selected').removeClass('selected')
    @editor.sync()

    @editor.trigger 'valuechanged', ['undo']

  update: () ->
    return if @_timer
    currentState = @currentState()
    return unless currentState

    html = @editor.body.html()
    currentState.html = html
    currentState.caret = @caretPosition()

  _getNodeOffset: (node, index) ->
    if index
      $parent = $(node)
    else
      $parent = $(node).parent()

    offset = 0
    merging = false
    $parent.contents().each (i, child) =>
      if index == i or node == child
        return false

      if child.nodeType == 3
        if !merging
          offset += 1
          merging = true
      else
        offset += 1
        merging = false

      null

    offset

  _getNodePosition: (node, offset) ->
    if node.nodeType == 3
      prevNode = node.previousSibling
      while prevNode and prevNode.nodeType == 3
        node = prevNode
        offset += @editor.util.getNodeLength prevNode
        prevNode = prevNode.previousSibling
    else
      offset = @_getNodeOffset(node, offset)

    position = []
    position.unshift offset
    @editor.util.traverseUp (n) =>
      position.unshift @_getNodeOffset(n)
    , node

    position

  _getNodeByPosition: (position) ->
    node = @editor.body[0]

    for offset, i in position[0...position.length - 1]
      childNodes = node.childNodes
      if offset > childNodes.length - 1
        # when pre is empty, the text node will be lost
        if i == position.length - 2 and $(node).is('pre')
          child = document.createTextNode ''
          node.appendChild child
          childNodes = node.childNodes
        else
          node = null
          break
      node = childNodes[offset]

    node

  caretPosition: (caret) ->
    # calculate current caret state
    if !caret
      range = @editor.selection.getRange()
      return {} unless @editor.inputManager.focused and range?

      caret =
        start: []
        end: null
        collapsed: true

      caret.start = @_getNodePosition(range.startContainer, range.startOffset)

      unless range.collapsed
        caret.end = @_getNodePosition(range.endContainer, range.endOffset)
        caret.collapsed = false

      return caret

    # restore caret state
    else
      @editor.body.focus() unless @editor.inputManager.focused

      unless caret.start
        @editor.body.blur()
        return

      startContainer = @_getNodeByPosition caret.start
      startOffset = caret.start[caret.start.length - 1]

      if caret.collapsed
        endContainer = startContainer
        endOffset = startOffset
      else
        endContainer = @_getNodeByPosition caret.end
        endOffset = caret.start[caret.start.length - 1]

      if !startContainer or !endContainer
        throw new Error 'simditor: invalid caret state'
        return

      range = document.createRange()
      range.setStart(startContainer, startOffset)
      range.setEnd(endContainer, endOffset)

      @editor.selection.selectRange range




