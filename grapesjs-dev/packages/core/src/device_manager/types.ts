/**{START_EVENTS}*/
export enum DeviceEvents {
  /**
   * @event `device:add` New device added to the collection. The `Device` is passed as an argument.
   * @example
   * editor.on('device:add', (device) => { ... });
   */
  add = 'device:add',
  addBefore = 'device:add:before',

  /**
   * @event `device:remove` Device removed from the collection. The `Device` is passed as an argument.
   * @example
   * editor.on('device:remove', (device) => { ... });
   */
  remove = 'device:remove',
  removeBefore = 'device:remove:before',

  /**
   * @event `device:select` A new device is selected. The `Device` is passed as an argument.
   * @example
   * editor.on('device:select', (device) => { ... });
   */
  select = 'device:select',
  selectBefore = 'device:select:before',

  /**
   * @event `device:update` Device updated. The `Device` and the object containing changes are passed as arguments.
   * @example
   * editor.on('device:update', (device) => { ... });
   */
  update = 'device:update',

  /**
   * @event `device` Catch-all event for all the events mentioned above.
   * @example
   * editor.on('device', ({ event, model, ... }) => { ... });
   */
  all = 'device',
}
/**{END_EVENTS}*/

// This is necessary to prevent the TS documentation generator from breaking.
export default DeviceEvents;
