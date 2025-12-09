// ==UserScript==
// @name         Frog Assistant
// @version      1.0.21
// @description  Automatically browse and play SwordAndSupper missions.
// @author       u/Smartjacky
// @match        https://www.reddit.com/r/SwordAndSupperGame/*
// @match        https://www.reddit.com/r/SwordAndSupper/*
// @include      /^https:\/\/www\.reddit\.com\/user\/[\w\-]+\/submitted\/$/
// @match        https://*.devvit.net/index.html*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_addValueChangeListener
// ==/UserScript==

(function () {
  'use strict';

  GM_addStyle(`
    .autoplay {
      border-color: #FF4500;
      background-color: #FF4500;
      color: white;
      margin-right: 1em;
    }

    .autoplay:hover {
      text-decoration: none;
    }

    .autoplay.disabled {
      border-color: grey;
      background-color: grey;
      cursor: not-allowed;
    }
    
    .sort-controls > * {
      margin: 0 2px 0 2px;
    }

    .modal-content {
      justify-content: normal !important;
    }

    .cover {
      position: absolute;
      top: 0px;
      left: 0px;
      width: 100%;
      height: 100%;
      background-color: black;
      opacity: 80%;
      z-index: 9999;
    }

    .abort-button {
      font-family: Poppins-ExtraBold, sans-serif;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 20%;
      height: 10%;
      background-image: linear-gradient(to bottom,rgb(255, 80, 80),rgb(255, 80, 80) 10%,rgb(209, 80, 80) 10%, rgb(209, 80, 80));
      opacity: 100%;
      z-index: 99999;
    }

    .abort-button:hover {
      background-image: linear-gradient(to bottom,rgb(255, 80, 80),rgb(255, 80, 80) 10%,rgb(198, 95, 95) 10%, rgb(198, 95, 95));
    }

    .abort-button:active {
      background-image: linear-gradient(to bottom,rgb(255, 80, 80),rgb(255, 80, 80) 10%,rgba(155, 75, 75, 1) 10%, rgb(155, 75, 75));
    }

    .assistant-settings {
      display: block !important;
      font-size: 0.4em;
    }

    .assistant-settings > h3 {
      -webkit-text-stroke: 0.15em black;
      text-stroke: 0.15em black;
      paint-order: stroke fill;
      font-size: 1.5em;
      text-align: center;
    }

    .pause-button {
      pointer-events: auto;
      width: 20px;
      height: 20px;
      min-width: 20px;
      min-height: 20px;
      white-space: nowrap;
      padding: 0.8em;
      border: 3px solid black;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-sizing: border-box;
      border-radius: 20%;
      background: linear-gradient(#FD737A 45%, #F62E49 65%);
    }

    .pause-button > div {
      font-size: 1.2em;
    }
    
    .pause-button:hover > div {
      transform: scale(1.15);
    }
    
    .pause-button:active > div {
      transform: scale(0.95);
    }

    .settings-content:has(> div) {
      display: block !important;
    }

    input.settings-input[type="number"] {
      width: 60px;
    }

    #mission-list-wrapper {
      flex-direction: column;
      overflow: scroll;
      height: 100%;
    }

    #mission-list-wrapper > div label {
      margin-right: 0.5em;
    }

    #mission-list-wrapper > div span {
      color: white;
      -webkit-text-stroke: 0px;
      width: fit-content;
      padding: 0.2rem 0.5rem;
      border-radius: 5px;
      font-size: 0.6rem;
      height: fit-content;
    }

    #mission-list-wrapper > div > div {
      align-items: center;
    }

    #mission-list-wrapper > div {
      margin: 0.3rem 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-radius: 5px;
      padding: 0.5rem 1rem;
    }

    .map-creator-start-button-wrapper {
      justify-content: center;
    }

    .mission-creator-filter-wrapper > *:not(:first-child, :last-child) {
      margin: 0 0.5rem;
    } 

    .map-creator-start-button-wrapper > div {
      margin: 1rem 0;
      flex-direction: column;
      align-items: center;
    }

    .map-creator-start-button-wrapper > div > span:nth-child(2) {
      text-align: center;
      padding: 0.1rem 0.7rem;
      background-color: #818181;
      width: fit-content;
      font-size: 0.8rem;
      border-radius: 5px;
      margin-top: 5px;
      border: 2px solid black;
    }
    
    .map-creator-start-button-wrapper > button {
      margin: 1rem;
      padding: 1.5rem 4rem;
      font-size: 1.5rem;
      color: white;
      border-radius: 10px;
    }

    .mission-creator-filter-wrapper {
      justify-content: space-between;
      margin: 0 1rem 0.5rem 1rem;
    }

    .mission-creator-filter-wrapper > input[type="text"] {
      border: 2px solid black;
      border-radius: 5px;
      padding: 0 0.5rem;
      width: 80%;
      margin-right: 1rem;
      box-sizing: border-box;
      -webkit-text-stroke-width: 1px;
    }
    
    .mission-creator-filter-wrapper > input[type="text"]::placeholder {
      -webkit-text-stroke-width: thin;
    }

    .apply-all-wrapper input[type="number"] {
      width: 100%;
      height: 100%;
      max-width: 5rem;
      padding: 0.5rem;
      margin: 0;
      border: 2px solid black;
      border-right: none;
      border-radius: 5px 0px 0px 5px;
      -webkit-text-stroke-width: 2px;
    }

    .apply-all-wrapper button, .map-quantity-selector button {
      border-radius: 0 5px 5px 0;
      font-size: 0.8rem;
      text-transform: uppercase;
    }

    .empty-bag-message .sort-button {
      display: none;
    }

    .custom-menu-header .item-title {
      margin: 1rem 0 0 0;
    }

    .map-quantity-selector {
      height: 100%
    }

    .map-quantity-selector input[type="number"] {
      height: 100%;
      padding: 0 0.5rem;
      border: 2px solid black;
      border-radius: 5px 0 0 5px;
      border-right: none;
      -webkit-text-stroke-width: 2px;
    }

    #missionCreateProgress {
      font-family: Poppins-ExtraBold, sans-serif;
      position: absolute;
      top: 34%;
      left: 50%;
      transform: translate(-50%, -50%);
      opacity: 100%;
      z-index: 99999;
      text-shadow: 0px 2px 0px black;
      margin: 0;
      color: white;
      -webkit-text-stroke-width: 1px;
      -webkit-text-stroke-color: black;
      text-align: center;
    }

    .item-list {
      overflow: scroll;
      flex-wrap: wrap;
      margin: 0 1rem;
      padding-top: 0.5rem;
      min-width: 362px;
      height: 100%;
    }

    .item-list > div {
      width: 72px;
      height: 72px;
    }

    .item-list > div > span {
      position: absolute;
      font-size: 1rem;
      text-wrap: nowrap;
      background: rgba(0, 0, 0, 0.8);
      padding: 0.5rem;
      z-index: 3;
      border-radius: 5px;
      pointer-events: none;
    }

    .item-list .equipment-slot:hover {
      transform: none;
    }

    .item-level-label {
      position: absolute;
      bottom: 0;
      padding: 0 0 0.5rem 0.5rem;
      font-size: .8rem;
      pointer-events: none;
    }

    .item-image-container {
      pointer-events: none;
    }

    .equipment-slot .cover {
      border-radius: 20px;
      pointer-events: none;
    }

    .equipment-slot .cover svg {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 30%;
      height: 30%;
    }

    .cover.hidden {
      display: none !important;
    }
  `);

  /**
   * @typedef {'equipment' | 'blueprint' | 'map'} TabType
   */

  /**
   * @typedef {{ path: string, type: TabType }} InventoryTab
   */

  /**
   * @typedef {{ name: string, type: string, escape: (value: any) => any default: boolean, value: any }} GameSetting
   */

  /**
   * @typedef { 'uncommon' | 'common' | 'rare' | 'epic' | 'legendary' | 'mythic' } ItemRarity
   */

  /**
   * @typedef {{ color: string, altColor: string }} ItemRarityColor
   */

  /**
   * @typedef {{ name: string, rarity: ItemRarity, quantity: number, maxQuantity: number }} MissionMap
   */

  /**
   * @typedef {{ difficulty: string, level: string, mapType: string }} MissionMetadata
   */

  /**
   * @typedef {{ name: string, assetName?: string, rarity?: string, sellPrice?: number, requiredLevel?: number }} ItemData
   */

  /**
   * Replaces window.performance.now to manipulate animation speed.
   */
  class FastPerformance {
    static performanceNowValue = null;
    static previusPerformanceNowValue = null;
    static originalPerformanceNow = window.performance.now.bind(performance);

    /**
     * Swaps performance.now with FastPerformance.now.
     */
    static swap() {
      performance.now = FastPerformance.now;
      console.log('[Frog Assistant] Replaced vanilla performance.now()');
    }

    /**
     * Acts the same as performance.now but runs at different speed.
     */
    static now() {
      const originalValue = FastPerformance.originalPerformanceNow();
      if (FastPerformance.performanceNowValue) {
        FastPerformance.performanceNowValue +=
          (originalValue - FastPerformance.previusPerformanceNowValue)
          * Game.getSetting('animationSpeed');
      } else {
        FastPerformance.performanceNowValue = originalValue;
      }
      FastPerformance.previusPerformanceNowValue = originalValue;
      return Math.floor(FastPerformance.performanceNowValue);
    }
  }

  /**
   * Replaces window.Date.now to manipulate animation speed.
   */
  class FastDate {
    static dateNowValue = null;
    static previusDateNowValue = null;
    static originalDateNow = unsafeWindow.Date.now;

    /**
     * Swaps Date.now with FastDate.now.
     */
    static swap() {
      unsafeWindow.Date.now = FastDate.now;
      console.log('[Frog Assistant] Replaced vanilla Date.now()');
    }

    /**
     * Acts the same as Date.now but runs at different speed.
     */
    static now() {
      const originalValue = FastDate.originalDateNow();
      if (FastDate.dateNowValue) {
        FastDate.dateNowValue +=
          (originalValue - FastDate.previusDateNowValue)
          * Game.getSetting('animationSpeed');
      } else {
        FastDate.dateNowValue = originalValue;
      }
      FastDate.previusDateNowValue = originalValue;
      return Math.floor(FastDate.dateNowValue);
    }
  }

  /**
   * Replaces window.requestAnimationFrame to manipulate animation speed.
   */
  class CustomRequestAnimationFrame {
    /**
     * Swaps window.requestAnimationFrame with CustomRequestAnimationFrame.requestAnimationFrame.
     */
    static swap() {
      unsafeWindow.requestAnimationFrame = CustomRequestAnimationFrame.requestAnimationFrame;
    }

    /**
     * Acts the same as window.requestAnimationFrame but uses unsafeWindow.performance.now instead.
     */
    static requestAnimationFrame(s) {
      setTimeout(() => {
        s(unsafeWindow.performance.now());
      })
      return 1;
    }
  }

  /**
   * Represents an timeout error.
   */
  class TimeoutError extends Error {
    constructor(message) {
      super(message);
      this.name = 'TimeoutError';
    }
  }

  /**
   * Basic bot providing simple functions.
   */
  class BotUtils {
    /**
     * Waits {@link ms} milliseconds.
     * @param {number} ms milliseconds to wait
     */
    static async wait(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }

    /**
     * Waits for a selector to appear on the DOM until timeout.
     * @param {Element} parent The parent element of the selector.
     * @param {string} path The path of the selector.
     * @param {number} timeout The amount of time to wait before timeout.
     */
    static async waitForSelector(parent, path, timeout = 30000) {
      let timeSpent = 0;
      let result = null;
      while (result = parent.querySelector(path), !result && timeSpent < timeout) {
        await BotUtils.wait(100);
        timeSpent += 100;
      }
      if (result === null) throw new TimeoutError(`Timed out after waiting on ${path} for ${timeout}ms`);
      return result;
    }

    /**
     * Waits for a selector to disappear on the DOM until timeout.
     * @param {Element} The parent element of the selector.
     * @param {string} The path of the selector.
     * @param {number} timeout The amount of time to wait before timeout.
     */
    static async waitForSelectorToHide(parent, path, timeout = 30000) {
      let timeSpent = 0;
      while (parent.querySelector(path) && timeSpent < timeout) {
        await BotUtils.wait(100);
        timeSpent += 100;
      }
      if (parent.querySelector(path)) {
        throw new TimeoutError(`Timed out after waiting on ${path} for ${timeout}ms`);
      }
    }
  }

  /**
   * Dupe seller bot.
   */
  class DupeSeller {
    /**
     * A whitelist of items that will be not be sold even if dupelicates are found.
     * @type {Set<string>}
     */
    static WHITELIST = new Set(GM_getValue('whitelist', '').split(','));

    /** 
     * Indicates if the dupe seller is actively checking and selling items. 
     * @type {boolean}
     */
    static #inProgress = false;

    /**
     * Injects a cover over the game to prevent the player interacting with the game.
     */
    static #injectCover() {
      const cover = document.createElement('div');
      cover.classList.add('cover');
      document.querySelector('body').append(cover);
    }

    /**
     * Injects an abort button to allow the player to stop the selling immediately.
     */
    static #injectAbortButton() {
      const abortButton = document.createElement('button');
      abortButton.classList.add('sort-button');
      abortButton.classList.add('abort-button');
      abortButton.textContent = 'ABORT';
      abortButton.addEventListener('click', () => {
        document.querySelector('.cover')?.remove();
        abortButton.remove();
        DupeSeller.#inProgress = false;
      })
      document.querySelector('body').append(abortButton);
    }

    /**
     * Injects a cover and a abosrt button then begins the dupe selling process.
     */
    static #sellDupes() {
      DupeSeller.#injectCover();
      DupeSeller.#injectAbortButton();
      BotUtils.waitForSelector(document, '.equipment-management.shown')
        .then(() => {
          DupeSeller.#processTabs([
            { path: '.nav .nav-item:nth-child(1)', type: 'equipment' },
            { path: '.nav .nav-item:nth-child(2)', type: 'blueprint' },
            { path: '.nav .nav-item:nth-child(4)', type: 'map' }])
            .then(() => {
              console.log('[Frog Assistant] All duplicate gears removed successfully.');
              document.querySelector('.cover')?.remove();
              document.querySelector('.abort-button')?.remove();
              DupeSeller.#inProgress = false;
            })
            .catch(err => console.error('Unable to process tab', err));
        })
        .catch(err => console.error('Unable to open inventory', err));
    }

    /**
     * Switches the sort mode to A-Z in the inventory menu.
     */
    static async #switchToAZMode() {
      const sortBtn = document.querySelector('.sort-button');
      if (sortBtn && sortBtn.title === 'Toggle between sort methods') {
        while (sortBtn.textContent !== 'Sort: A-Z') {
          sortBtn.click();
          await BotUtils.wait(100);
        }
      }
    }

    /**
     * Processes an array of tabs.
     * @param {InventoryTab[]} tabs An array of selectors to be processed.
     */
    static async #processTabs(tabs) {
      const tab = tabs.shift();
      if (tab === undefined) return;
      const tabPath = tab.path;
      const bag = await DupeSeller.#prepairTab(tabPath);
      if (bag) {
        let items = document.querySelectorAll('.virtual-items-grid .equipment-slot');
        let count = 0;
        let completed = false;
        while (DupeSeller.#inProgress && !completed) {
          const item = items[count];
          if (!item.parentElement) continue;
          const itemY = Number(item.parentElement.style.top.replace('px', ''));
          const itemName = item.querySelector('.item-image-container > img').getAttribute('alt');
          const itemRarity = item.style.backgroundImage;
          try {
            await DupeSeller.#processItem(item, tab.type);
            if (++count >= items.length) {
              bag.scroll(0, itemY);
              await BotUtils.wait(100);
              items = document.querySelectorAll('.virtual-items-grid .equipment-slot');
              let newCount = DupeSeller.#findAnchor([...items], itemName, itemRarity);
              if (newCount == -1) throw new Error('Unable to find item anchor');
              else if (newCount == items.length - 1) completed = true;
              else count = newCount + 1;
            }
          } catch (err) {
            items = document.querySelectorAll('.virtual-items-grid .equipment-slot');
          }
        }
      }
      console.log(`[Frog Assistant] Sold all dupes on tab ${tabPath}`);
      if (DupeSeller.#inProgress) await DupeSeller.#processTabs(tabs);
    }

    /**
     * Finds the the index of an item with itemName and itemRarity in itemsArray.
     * @param {Element[]} itemsArray 
     * @param {string} itemName 
     * @param {string} itemRarity 
     * @returns {number} The index of the matched item or -1 if nothing found.
     */
    static #findAnchor(itemsArray, itemName, itemRarity) {
      for (let i = 0; i < itemsArray.length; i++) {
        const newItemName = itemsArray[i].querySelector('.item-image-container > img').getAttribute('alt');
        const newItemRarity = itemsArray[i].style.backgroundImage;
        if (newItemName === itemName && itemRarity === newItemRarity) {
          return i;
        }
      }
      return -1;
    }

    /**
     * Sets and checks to make sure the tab is ready to be processed.
     * @param {string} tabPath The path of the tab to be processed.
     * @return {Promise<Element>} The equipment bag element. 
     */
    static async #prepairTab(tabPath) {
      try {
        DupeSeller.#switchToTab(tabPath);
        await BotUtils.wait(500);
        const bag = await DupeSeller.#getEquipmentBag();
        await DupeSeller.#switchToAZMode();
        bag.scroll(0, 0);
        await BotUtils.wait(500);
        return bag;
      } catch (err) {
        return undefined;
      }
    }

    /**
     * Clicks the tab and switches to it.
     * @param {string} tabPath The path of the tab to be processed.
     */
    static #switchToTab(tabPath) {
      const tab = document.querySelector(tabPath);
      if (!tab) {
        throw new Error(`${tabPath} is an invalid path`);
      }
      tab.click();
    }

    /**
     * Gets the equipment bag element.
     * @returns {Promise<Element>} The equipment bag element.
     */
    static async #getEquipmentBag() {
      return await BotUtils.waitForSelector(document, '.virtual-items-grid', 1000);
    }

    /**
     * Sells the item if it is already in the item list, keeps it otherwise.
     * @param {Element} item The item element to be processed.
     * @param {TabType} tabType The type of the tab that this item belongs in.
     */
    static async #processItem(item, tabType) {
      const itemName = item.querySelector('.item-image-container > img').getAttribute('alt');
      if (!itemName) throw new Error('Item name not found');
      let itemQuantityElem = item.querySelector('.item_quantity');
      const backgroundImg = item.style?.backgroundImage;
      if (!backgroundImg) throw new Error('Unable to find the rarity for a map');
      const rarity = backgroundImg.substring(25, backgroundImg.length - 6);
      const maxQuan = DupeSeller.#getMaxQuantity(tabType);
      const itemQuantity = Number(itemQuantityElem?.textContent ?? '1');
      if (!DupeSeller.WHITELIST.has(`${itemName}/${rarity}`) && itemQuantity > maxQuan) {
        let count = itemQuantity;
        while (count > maxQuan && DupeSeller.#inProgress) {
          item.click();
          await BotUtils.waitForSelector(document, '.item-modal-content.shown', 500);
          await DupeSeller.#sellItem();
          console.log(`[Frog Assistant] Sold duplicate item: ${itemName}`);
          count--;
        }
      }
    }

    /**
     * Gets the maximum quantity an item may have before deleteing extras.
     * @param {TabType} tabType 
     * @returns {number} The maximum quantity.
     */
    static #getMaxQuantity(tabType) {
      switch (tabType) {
        case 'blueprint':
          return Game.getSetting('maxBP');
        case 'equipment':
          return Game.getSetting('maxEquip');
        case 'map':
          return Game.getSetting('maxMap');
        default:
          throw new Error(`Unknown TabType ${tabType}`);
      }
    }

    /**
     * Closes the item menu.
     */
    static async #closeItemMenu() {
      const closeButton = await BotUtils.waitForSelector(document, '.item-modal-dismiss-button');
      if (!closeButton) {
        throw new Error(`Item menu not found. `)
      };
      closeButton.click();
    }

    /**
     * Waits for the item menu to close.
     */
    static async #waitForItemMenuToClose() {
      try {
        await BotUtils.waitForSelectorToHide(document, '.item-modal-dismiss-button', 500);
      } catch (err) {
        if (!(err instanceof TimeoutError)) {
          throw err;
        };
        await DupeSeller.#closeItemMenu();
      }
    }

    /**
     * Clicks the sell button.
     */
    static async #clickSellButton() {
      const sellBtn = await BotUtils.waitForSelector(document, '.item-sell-button img');
      if (!sellBtn) throw new Error(`Sell button not found.`);
      sellBtn.click();
    }

    /**
     * Clicks the confirm button.
     */
    static async #clickConfirmButton() {
      const confirmBtn = await BotUtils.waitForSelector(document, '.confirm-content .confirm-button.continue');
      if (!confirmBtn) throw new Error(`Confirm button not found.`);
      confirmBtn.click();
    }

    /**
     * Sells the current item.
     */
    static async #sellItem() {
      await DupeSeller.#clickSellButton();
      await BotUtils.waitForSelector(document, 'div.modal.shown', 1000);
      await DupeSeller.#clickConfirmButton();
      await DupeSeller.#waitForItemMenuToClose();
    }

    /**
     * Compares if item1 is more rare than item2
     * @param {ItemData} item1 
     * @param {ItemData} item2 
     * @returns {boolean} True if item1 is more than item2 and false otherwise.
     */
    static isMoreRare(item1, item2) {
      if (!item1.rarity || !item2.rarity) throw new Error('item1/item2 does not have a rarity value');
      const rarityValues = { common: 1, uncommon: 2, rare: 3, epic: 4, legendary: 5, mythic: 6 };
      return rarityValues[item2.rarity] - rarityValues[item1.rarity];
    }

    /**
     * Creates an item list element.
     * @param {ItemData[]} items
     * @returns {HTMLDivElement} The item list element.
     */
    static #createItemList(items) {
      const itemsWrapper = document.createElement('div');
      const equipment = items.filter(item => DupeSeller.#isEquipment(item))
        .sort((a, b) => DupeSeller.isMoreRare(a, b));
      itemsWrapper.classList.add('item-list');
      /** @param {ItemData} itemData */
      equipment.forEach((itemData) => {
        const itemOutterWrapper = document.createElement('div');
        const itemInnerWrapper = document.createElement('div');
        itemInnerWrapper.classList.add('equipment-slot');
        itemInnerWrapper.style.backgroundImage = `url("/assets/ui/equip_bg_${itemData.rarity}.png")`;
        itemOutterWrapper.append(itemInnerWrapper);
        itemInnerWrapper.addEventListener('click', () => {
          const cover = itemInnerWrapper.querySelector('.cover');
          if (cover.classList.contains('hidden')) {
            cover.classList.remove('hidden');
            DupeSeller.WHITELIST.add(`${itemData.name}/${itemData.rarity}`);
            DupeSeller.#storeWhitelist();
          } else {
            cover.classList.add('hidden');
            DupeSeller.WHITELIST.delete(`${itemData.name}/${itemData.rarity}`);
            DupeSeller.#storeWhitelist();
          }
        });
        DupeSeller.#addItemTooltip(itemInnerWrapper, itemData.name);
        const item = document.createElement('div');
        const itemImageContainer = document.createElement('div');
        const itemImage = DupeSeller.#createItemImage(itemData);
        itemImage.setAttribute('rarity', itemData.rarity);
        item.classList.add('item-content');
        itemImageContainer.classList.add('item-image-container');
        itemImageContainer.append(itemImage);
        item.append(itemImageContainer);
        itemInnerWrapper.append(DupeSeller.#createLockedItemCover(DupeSeller.WHITELIST.has(`${itemData.name}/${itemData.rarity}`)));
        itemInnerWrapper.append(item);
        const labelRegex = /(Lvl [\d]$)|(EX$)|(Ultimate$)/;
        if (labelRegex.test(itemData.name)) {
          itemInnerWrapper.append(DupeSeller.#createItemLevelLabel(itemData.name.match(labelRegex)[0]));
        }
        itemsWrapper.append(itemInnerWrapper);
      });
      return itemsWrapper;
    }

    /**
     * Adds a hover tooltip to an item element.
     * @param {HTMLDivElement} itemElement 
     * @param {string} tooltipText 
     */
    static #addItemTooltip(itemElement, tooltipText) {
      const tooltip = document.createElement('span');
      tooltip.style.display = 'none';
      tooltip.textContent = tooltipText;
      itemElement.addEventListener('mouseenter', (e) => {
        itemElement.style.zIndex = 2;
        itemElement.querySelector('span').style.display = 'block';
      });
      itemElement.addEventListener('mouseleave', () => {
        itemElement.style.zIndex = 1;
        itemElement.querySelector('span').style.display = 'none';
      });
      itemElement.addEventListener('mousemove', (e) => {
        const label = itemElement.querySelector('span');
        const itemListBounds = itemElement.parentElement.getBoundingClientRect();
        label.style.left = e.offsetX - label.clientWidth / 2;
        const newBounds = label.getBoundingClientRect();
        if (newBounds.left < itemListBounds.left) {
          label.style.left = 0;
        } else if (newBounds.right > itemListBounds.right) {
          label.style.left = 72 - label.clientWidth;
        }
        label.style.top = (e.y + 30 + label.clientHeight > itemListBounds.bottom) ?
          e.offsetY - 15 - label.clientHeight : e.offsetY + 30;
      })
      itemElement.append(tooltip)
    }

    /**
     * Stores the whitelist to local storage.
     */
    static #storeWhitelist() {
      let items = '';
      DupeSeller.WHITELIST.forEach(value => items += value + ',');
      GM_setValue('whitelist', items);
    }

    /**
     * Calculates the gap size for the item list.
     * @param {number} listWidth
     */
    static #getGapSize(listWidth) {
      const itemWidth = 72;
      const minGapSize = 16;
      let itemsPerRow = Math.max(1, Math.round(listWidth / itemWidth));
      let freeSpace = listWidth - itemsPerRow * itemWidth;
      while (itemsPerRow > 1 && freeSpace < minGapSize * (itemsPerRow - 1)) {
        itemsPerRow--;
        freeSpace = listWidth - itemsPerRow * itemWidth;
      }
      return freeSpace / Math.max(1, itemsPerRow - 1);
    }

    /**
     * Creates a cover for a locked item.
     * @param {boolean} shown Determines whether the cover shoud be shown or not.
     * @returns {HTMLDivElement} The cover element.
     */
    static #createLockedItemCover(shown = false) {
      const cover = document.createElement('div');
      cover.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-lock" viewBox="0 0 16 16">
    <path fill-rule="evenodd" d="M8 0a4 4 0 0 1 4 4v2.05a2.5 2.5 0 0 1 2 2.45v5a2.5 2.5 0 0 1-2.5 2.5h-7A2.5 2.5 0 0 1 2 13.5v-5a2.5 2.5 0 0 1 2-2.45V4a4 4 0 0 1 4-4M4.5 7A1.5 1.5 0 0 0 3 8.5v5A1.5 1.5 0 0 0 4.5 15h7a1.5 1.5 0 0 0 1.5-1.5v-5A1.5 1.5 0 0 0 11.5 7zM8 1a3 3 0 0 0-3 3v2h6V4a3 3 0 0 0-3-3"/>
  </svg>`;
      cover.classList.add('cover');
      cover.classList.add(shown ? 'shown' : 'hidden');
      return cover;
    }

    /**
     * Creates an label that correspond to an item's level.
     * @param {string} labelName 
     * @returns {HTMLDivElement} The element.
     */
    static #createItemLevelLabel(labelName) {
      const wrapper = document.createElement('div');
      const label = document.createElement('span');
      label.textContent = labelName.replace(' EX', 'EX');
      wrapper.append(label);
      wrapper.classList.add('item-level-label');
      return wrapper;
    }

    /**
     * Creates a menu description element.
     * @returns {HTMLSpanElement} The menu desc.
     */
    static #createMenuDesc() {
      const desc = document.createElement('span');
      desc.textContent = 'Click on an item to save it to the whitelist'
      desc.style.margin = '1rem';
      return desc;
    }

    /**
     * Creates an item image element.
     * @param {ItemData} itemData 
     * @returns {HTMLImageElement} The item image element.
     */
    static #createItemImage(itemData) {
      const itemImage = document.createElement('img');
      itemImage.loading = 'lazy';
      itemImage.alt = itemData.name;
      itemImage.classList.add('item-image');
      itemImage.draggable = false;
      itemImage.src = `/assets/ui/item-icons/${itemData.assetName}.png`;
      return itemImage;
    }

    /**
     * Creates an item filter element.
     * @return {HTMLDivElement}
     */
    static #createItemFilter() {
      const wrapper = document.createElement('div');
      const lockAll = () => {
        const equipments = Game.ITEMS.filter(item => DupeSeller.#isEquipment(item));
        equipments.forEach(equm => {
          const imgElem = document.querySelector(`.item-list .equipment-slot img[alt="${equm.name}"][rarity=${equm.rarity}]`);
          const itemElem = imgElem.parentElement?.parentElement?.parentElement;
          if (itemElem && itemElem.querySelector('.cover')?.classList.contains('hidden')) {
            itemElem.click();
          }
        });
      }
      const unlockAll = () => {
        const equipments = Game.ITEMS.filter(item => DupeSeller.#isEquipment(item));
        equipments.forEach(equm => {
          const imgElem = document.querySelector(`.item-list .equipment-slot img[alt="${equm.name}"][rarity=${equm.rarity}]`);
          const itemElem = imgElem.parentElement?.parentElement?.parentElement;
          if (itemElem && !itemElem.querySelector('.cover')?.classList.contains('hidden')) {
            itemElem.click();
          }
        });
      }
      wrapper.classList.add('mission-creator-filter-wrapper');
      wrapper.append(DupeSeller.#createSearchBar());
      wrapper.append(DupeSeller.#createFilterButton('LOCK ALL', lockAll));
      wrapper.append(DupeSeller.#createFilterButton('UNLOCK ALL', unlockAll));
      wrapper.style.minHeight = '2rem';
      return wrapper;
    }

    /**
     * Creates a filter button element.
     * @param {string} text The text inside the button.
     * @param {Function} clickCallback Callback function when the button is clicked.
     * @return {HTMLDivElement}
     */
    static #createFilterButton(text, clickCallback) {
      const button = document.createElement('button');
      button.addEventListener('click', clickCallback);
      button.classList.add('sort-button');
      button.textContent = text;
      button.style.textWrap = 'nowrap';
      return button;
    }

    /**
     * Creates an search bar element.
     * @return {HTMLDivElement}
     */
    static #createSearchBar() {
      const search = document.createElement('input');
      search.placeholder = 'Search...';
      search.type = 'text';
      search.style.width = '100%';
      search.style.margin = '0';
      search.addEventListener('input', () => {
        const itemElements = document.querySelectorAll('.item-modal-content .item-list .equipment-slot');
        itemElements.forEach((el) => {
          el.style.display = el.querySelector('img').alt.toLowerCase().includes(search.value.toLowerCase()) ? 'flex' : 'none';
        });
      });
      return search;
    }

    /**
     * Returns a start button.
     * @param {Function} startCallback The function called when the button is pressed.
     * @returns {HTMLElement} A start button.
     */
    static #createStartButton(startCallback) {
      const startBtnWrapper = document.createElement('div');
      const startBtn = document.createElement('button');
      startBtnWrapper.classList.add('map-creator-start-button-wrapper');
      startBtn.addEventListener('click', startCallback);
      startBtn.textContent = 'Start';
      startBtn.classList.add('pause-button');
      startBtnWrapper.append(startBtn);
      return startBtnWrapper;
    }

    /**
     * Checks whether an item is an equipment or not.
     * @param {ItemData} itemData The data of the item.
     * @returns {boolean} True if item is an equipment and false otherwise.
     */
    static #isEquipment(itemData) {
      return itemData.assetName && itemData.rarity && itemData.sellPrice;
    }

    /**
     * Opens the whitelist menu.
     */
    static openWhitelistMenu() {
      const overlay = Game.createTitledItemModalOverlay('Dupe Seller', () => { });
      const content = overlay.querySelector('.item-modal-content');
      const itemList = DupeSeller.#createItemList(Game.ITEMS);
      const start = () => {
        overlay.remove();
        DupeSeller.start();
      }
      content.append(DupeSeller.#createMenuDesc(),
        DupeSeller.#createItemFilter(), itemList, DupeSeller.#createStartButton(start));
      itemList.style.gap = `${DupeSeller.#getGapSize(itemList.clientWidth)}px`;
    }

    /**
     * Starts the dupe selling process.
     */
    static start() {
      if (DupeSeller.#inProgress) return;
      DupeSeller.#inProgress = true;
      DupeSeller.#sellDupes();
    }

    /**
     * Injects UI elements to the DOM.
     * @param {Element} parent The parent element that will holds all of the injected elements.
     */
    static injectUIElements(parent) {
      const sellDupeBtn = parent.querySelector('.sort-button').cloneNode(true);
      sellDupeBtn.textContent = 'Sell Dupes'
      sellDupeBtn.setAttribute('title', 'Sell duplicate items');
      sellDupeBtn.addEventListener('click', () => {
        DupeSeller.openWhitelistMenu();
      });
      parent.append(sellDupeBtn);
    }
  }

  /**
   * A bot that creates missions in batch.
   */
  class MissionCreator {
    /** @type {boolean} Indicates if the bot is current creating missions. */
    static #inProgress = false;

    /**
     * Injects a cover over the game to prevent the player interacting with the game.
     */
    static #injectCover() {
      const cover = document.createElement('div');
      cover.classList.add('cover');
      document.querySelector('body').append(cover);
    }

    /**
     * Injects an abort button to allow the player to stop the selling immediately.
     */
    static #injectAbortButton() {
      const abortButton = document.createElement('button');
      abortButton.classList.add('sort-button');
      abortButton.classList.add('abort-button');
      abortButton.textContent = 'ABORT';
      abortButton.addEventListener('click', () => {
        MissionCreator.#inProgress = false;
      })
      document.querySelector('body').append(abortButton);

      const progress = document.createElement('h2');
      progress.id = 'missionCreateProgress';
      document.querySelector('body').append(progress);
    }

    /**
     * Clicks through the map creation process until it reaches to the final submission menu.
     * Assumes map item menu is opened.
     */
    static async #clickToSubmitMenu() {
      const paths = ['.actions-button-row > button', '.autocomplete-button', '.mission-create-submit-button',
        '.food-choices > button', '.autocomplete-button', '.mission-create-submit-button', '#doRedirect'
      ]
      for (const path of paths) {
        let elem;
        if (!MissionCreator.#inProgress) return;
        while (!(elem = document.querySelector(path))) {
          if (!MissionCreator.#inProgress) return;
          await BotUtils.wait(50);
        }
        await elem.click();
        await BotUtils.wait(300);
      }
    }

    /**
     * Gets the mission metadata from the final submission menu.
     * Assumes the final submsision menu is opened.
     * @returns {MissionMetadata} The metadata of the to-be-created mission.
     */
    static #getMissionMedata() {
      const difficulty = Array.from(document.querySelectorAll('.mission-create-summary:nth-child(2) > span')).filter((n) => {
        return n.style?.color && n.style.color === 'gold';
      }).length;
      const mapType = (document.querySelector('.summary-text'))?.textContent?.substring(8);
      const level = (document.querySelector('.mission-create-summary:nth-child(3) > span'))?.textContent?.substring(12).replace(' ~ ', '-');
      const displayInfo = (difficulty === 0) ? 'BOSS RUSH' : `${difficulty}★`;
      if (!mapType && !level) {
        throw new Error('[Frog Assistant] Unable to create mission due to missing map info.');
      }
      return { difficulty: displayInfo, level: level, mapType: mapType };
    }

    /**
     * Creates the selected mission.
     */
    static async #createMission() {
      await MissionCreator.#clickToSubmitMenu();
      const metadata = MissionCreator.#getMissionMedata();
      const titleInput = document.querySelector('.input-section > input');
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        "value"
      ).set;
      nativeInputValueSetter.call(titleInput, `${metadata.level} | ${metadata.difficulty} | ${metadata.mapType}`);
      ['input', 'change', 'keyup', 'blur'].forEach(eventType => {
        const event = new Event(eventType, { bubbles: true });
        titleInput.dispatchEvent(event);
      });
      await BotUtils.wait(250);
      if (!MissionCreator.#inProgress) return;
      document.querySelector('.mission-create-submit-button')?.click();
      await BotUtils.waitForSelectorToHide(document, 'item-modal-content');
    }

    /**
     * Find the map element in the player's inventory with name and rarityImg. 
     * @param {string} name The map with this name.
     * @param {ItemRarity} rarity The rarity of the map.
     * @returns {HTMLElement | undefined} The map element if found and undefined otherwise.
     */
    static #findMap(name, rarity) {
      const maps = [...document.querySelectorAll('.virtual-items-grid .equipment-slot')];
      return maps.find(el => {
        const mapName = el.querySelector('.item-image-container > img');
        const backgroundImg = el.style?.backgroundImage ?? '';
        if (!mapName || !backgroundImg) throw new Error(`Unable to find ${name} or its rarity`);
        return mapName.alt === name && backgroundImg.substring(25, backgroundImg.length - 6) === rarity;
      });
    }

    /**
     * Use a map with name and rarity for quantity times.
     * @param {string} name The name of the map.
     * @param {ItemRarity} rarity The rarity of the map.
     * @param {number} quantity The quantity of missions to create.
     */
    static async #useMap(name, rarity, quantity) {
      for (let i = 0; i < quantity; i++) {
        let timeSpent = 0;
        if (MissionCreator.#inProgress) {
          document.querySelector('#missionCreateProgress').textContent = `Creating mission at [${rarity.toUpperCase()}] ${name}... (${i + 1}/${quantity})`;
          while (!document.querySelector('.item-modal-content') && timeSpent <= 500) {
            MissionCreator.#findMap(name, rarity)?.click();
            await BotUtils.wait(50);
            timeSpent += 50;
          }
          await MissionCreator.#createMission();
        }
      }
    }

    /**
     * Use a list of different maps.
     * @param {MissionMap[]} missionMaps 
     */
    static async #useMaps(missionMaps) {
      for (const missionMap of missionMaps) {
        if (missionMap.quantity == 0 || !MissionCreator.#inProgress) continue;
        try {
          await MissionCreator.#useMap(missionMap.name, missionMap.rarity, missionMap.quantity);
          console.log(`[Frog Assistant] Successfully created all ${missionMap.name} maps!`);
        } catch (err) {
          console.log(`[Frog Assistant] Unable to create ${missionMap.name}. Skipping...`, err);
          continue;
        }
      }
      console.log(`[Frog Assistant] Successfully created all maps!`);
      document.querySelector('.cover').remove();
      document.querySelector('.abort-button').remove();
      document.querySelector('#missionCreateProgress').remove();
      MissionCreator.#inProgress = false;
    }

    /**
     * Injects the menu header to the menu.
     * @param {HTMLElement} menu The menu to insert to.
     */
    static #injectMenuHeader(menu) {
      const itemModalHeader = document.createElement('div');
      itemModalHeader.classList.add('item-modal-header');
      itemModalHeader.classList.add('custom-menu-header');
      itemModalHeader.style = 'background: radial-gradient(circle, rgb(47, 148, 252) 0%, rgb(74, 92, 225) 100%); padding-bottom: 1rem;';

      const headerTitleWrapper = document.createElement('div');
      const headerTitle = document.createElement('h2');
      headerTitleWrapper.classList.add('item-title');
      headerTitle.textContent = 'Mission Creator';
      headerTitleWrapper.append(headerTitle);
      itemModalHeader.append(headerTitleWrapper);
      menu.append(itemModalHeader);
    }

    /**
     * Returns an array of MissionMap
     * @param {HTMLElement[]} mapElements A list of map elements in the player's inventory.
     * @returns {MissionMap[]} An array of MissionMap sorted in alphabetical order.
     */
    static #getMapListData(mapElements) {
      return [...mapElements].map((el => {
        const name = el.querySelector('img').getAttribute('alt');
        const maxQuantity = el.querySelector('.item_quantity')?.textContent ?? '1';
        const backgroundImg = el.style?.backgroundImage;
        if (!backgroundImg) throw new Error('Unable to find the rarity for a map');
        const rarity = backgroundImg.substring(25, backgroundImg.length - 6);
        return { name: name, maxQuantity: maxQuantity, quantity: 0, rarity: rarity };
      })).sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
    }

    /**
     * Returns a map quantity option element. 
     * @param {MissionMap} missionMap
     * @returns {HTMLElement} The map quantity selector element.
     */
    static #createMapQuantityOption(missionMap) {
      const wrapper = document.createElement('div');
      const labelWrapper = document.createElement('div');
      const label = document.createElement('label');
      const quantity = document.createElement('span');
      const rarity = Game.RARITY_COLOR.get(missionMap.rarity) ?? Game.RARITY_COLOR.get('common');
      label.textContent = missionMap.name.replace('Map:', '');
      quantity.textContent = `x${missionMap.maxQuantity}`;
      quantity.style.backgroundColor = rarity.altColor;
      wrapper.style.backgroundColor = rarity.color;
      wrapper.style.border = `1px solid ${rarity.altColor}`;
      labelWrapper.append(label);
      labelWrapper.append(quantity);
      wrapper.append(labelWrapper);
      wrapper.append(MissionCreator.#createMapQuantitySelector(missionMap));
      return wrapper;
    }

    /**
     * Returns a map quantity selector element. 
     * @param {MissionMap} missionMap
     * @returns {HTMLElement} The map quantity selector element.
     */
    static #createMapQuantitySelector(missionMap) {
      const wrapper = document.createElement('div');
      const input = document.createElement('input');
      const maxBtn = document.querySelector('.sort-button').cloneNode(true);
      wrapper.classList.add('map-quantity-selector');
      maxBtn.textContent = 'max';
      maxBtn.setAttribute('title', 'Set to maximum amount');
      maxBtn.addEventListener('click', () => {
        input.value = (maxBtn.textContent === 'max') ? missionMap.maxQuantity : 0;
        maxBtn.textContent = (maxBtn.textContent === 'max') ? 'min' : 'max';
        input.dispatchEvent(new Event('change'));
      });
      input.type = 'number';
      input.value = missionMap.quantity;
      input.min = 0;
      input.max = missionMap.maxQuantity;
      input.addEventListener('change', () => {
        input.value = Math.min(Math.max(0, input.value), missionMap.maxQuantity);
        missionMap.quantity = input.value;
        MissionCreator.#updateMapCount();
      });
      wrapper.append(input);
      wrapper.append(maxBtn);
      return wrapper;
    }


    /**
     * Returns a start button.
     * @param {Function} startCallback The function called when the button is pressed.
     * @returns {HTMLElement} A start button.
     */
    static #createStartButton(startCallback) {
      const startBtnWrapper = document.createElement('div');
      const startBtn = document.createElement('button');
      const mapCountWrapper = document.createElement('div');
      const label = document.createElement('span');
      const mapCount = document.createElement('span');
      label.textContent = 'Total Map Count:'
      mapCount.id = 'mapCount';
      mapCount.textContent = 0;
      mapCountWrapper.append(label, mapCount);
      startBtnWrapper.classList.add('map-creator-start-button-wrapper');
      startBtn.addEventListener('click', startCallback);
      startBtn.textContent = 'Start';
      startBtn.classList.add('pause-button');
      startBtnWrapper.append(mapCountWrapper, startBtn);
      return startBtnWrapper;
    }

    /**
     * Injects a list of map info to the menu.
     * @param {HTMLElement} menu The menu to insert to.
     * @returns {MissionMap[]} List of MissionMap that can be used later on.
     */
    static #injectMapList(menu) {
      const maps = document.querySelectorAll('.virtual-items-grid .equipment-slot');
      const mapListWrapper = document.createElement('div');
      mapListWrapper.id = 'mission-list-wrapper';
      const data = MissionCreator.#getMapListData(maps);
      data.forEach((map) => {
        mapListWrapper.append(MissionCreator.#createMapQuantityOption(map));
      });
      menu.append(mapListWrapper);
      return data;
    }

    /**
     * Injects the menu description to the menu.
     * @param {HTMLElement} menu The menu to insert to.
     */
    static #injectMenuDesc(menu) {
      const desc = document.createElement('span');
      desc.textContent = 'Select each amount of maps to be used:'
      desc.style.margin = '1rem';
      menu.append(desc);
    }

    /**
     * Inject the apply all section to the menu.
     * @param {HTMLElement} menu The menu to insert to.
     */
    static #injectApplyAllSection(menu) {
      const wrapper = document.createElement('div');
      wrapper.classList.add('apply-all-wrapper');
      const maxBtn = document.querySelector('.sort-button').cloneNode(true);
      maxBtn.textContent = 'all';
      maxBtn.setAttribute('title', 'Apply quantity to all maps');
      maxBtn.addEventListener('click', () => {
        const newQuantity = quantityInput.value;
        const quantities = document.querySelectorAll('#mission-list-wrapper > div');
        quantities.forEach(el => {
          if (el.style.display === 'none') return;
          const input = el.querySelector('input');
          if (input) {
            input.value = Math.min(Math.max(0, newQuantity), input.max);
            input.dispatchEvent(new Event('change'));
          }
        });
      });

      const quantityInput = document.createElement('input');
      quantityInput.type = 'number';
      quantityInput.min = 0;
      quantityInput.value = Game.getSetting('missionBatchSize');
      quantityInput.placeholder = 'Quantity';

      wrapper.append(quantityInput);
      wrapper.append(maxBtn);
      menu.append(wrapper);
    }

    /**
     * Inject the filter section to the menu.
     * @param {HTMLElement} menu The menu to insert to.
     */
    static #injectFilterSection(menu) {
      const wrapper = document.createElement('div');
      const search = document.createElement('input');
      wrapper.classList.add('mission-creator-filter-wrapper');
      wrapper.append(search);
      search.placeholder = 'Search...';
      search.type = 'text';
      search.addEventListener('input', () => {
        const mapElements = document.querySelectorAll('#mission-list-wrapper > div');
        [...mapElements].forEach(el => {
          if (el.classList.contains('map-creator-start-button-wrapper')) return;
          const label = el.querySelector('label')?.textContent ?? '';
          el.style.display = label.toLowerCase().includes(search.value.toLowerCase()) ? 'flex' : 'none';
        });
      });
      MissionCreator.#injectApplyAllSection(wrapper);
      menu.append(wrapper);
    }

    static #updateMapCount() {
      const mapCountElement = document.getElementById('mapCount');
      if (mapCountElement) {
        const inputElements = document.querySelectorAll('#mission-list-wrapper input');
        mapCountElement.textContent = [...inputElements].reduce((p, c) => p += Number(c.value), 0);
      }
    }

    /**
     * Starts the mission creation process.
     */
    static start() {
      if (MissionCreator.#inProgress) return;
      MissionCreator.#inProgress = true;
      document.querySelector('.nav .nav-item:nth-child(4)')?.click();
      BotUtils.wait(250).then(() => {
        const onOverlayClose = () => {
          MissionCreator.#inProgress = false;
        };
        const overlay = Game.createTitledItemModalOverlay('Mission Creator', onOverlayClose);
        const itemModalContent = overlay.querySelector('div.item-modal-content');
        MissionCreator.#injectMenuDesc(itemModalContent);
        MissionCreator.#injectFilterSection(itemModalContent);
        const data = MissionCreator.#injectMapList(itemModalContent);
        const start = () => {
          console.log('[Frog Assistant] Maps creation process started!');
          document.querySelector('.item-modal-overlay')?.remove();
          MissionCreator.#injectCover();
          MissionCreator.#injectAbortButton();
          MissionCreator.#useMaps(data);
        };
        itemModalContent.append(MissionCreator.#createStartButton(start));
      });
    }

    /**
     * Injects UI elements to the DOM.
     * @param {Element} parent The parent element that will holds all of the injected elements.
     */
    static injectUIElements(parent) {
      const createMissionsBtn = parent.querySelector('.sort-button').cloneNode(true);
      createMissionsBtn.textContent = 'Create Missions'
      createMissionsBtn.setAttribute('title', 'Create missions in batch');
      createMissionsBtn.addEventListener('click', () => {
        MissionCreator.start();
      });
      parent.append(createMissionsBtn);
    }
  }

  /**
   * An bot that plays a mission automatically.
   */
  class Autoplayer {
    /** @type {boolean} Indicates if the bot is current playing a mission. */
    static #inProgress = false;

    /** @type {NodeJS.Timeout | null} */
    static #loop = null;

    /**
     * Sends a message to the Autobrowser.
     * @param {any} message The message being sent to the Autobrowser.
     */
    static #postMessage(message) {
      top.postMessage(message, 'https://www.reddit.com');
    }

    /**
     * Injects a pause button to the bottom-left corner of the game.
     */
    static #injectPauseBtn() {
      const btn = document.createElement('div');
      const btnLabel = document.createElement('div');
      btn.classList.add('pause-button');
      btnLabel.classList.add('advance-button-label');
      btnLabel.textContent = '⏵';
      btn.append(btnLabel);
      btn.addEventListener('click', () => {
        if (Autoplayer.#loop !== null) {
          Autoplayer.#stopAutoplay();
          document.querySelector('.pause-button > div').textContent = '⏵';
        } else {
          Autoplayer.#startAutoplay();
          document.querySelector('.pause-button > div').textContent = '⏸';
        }
      });
      document.querySelector('.ui-settings-wrapper').prepend(btn);
    }

    /**
     * Plays the current mission by checking existance of buttons and click them if they do.
     * Cross-roads fights are prioritized if found.
     */
    static #startAutoplay() {
      Autoplayer.#loop = setInterval(async () => {
        const paths = ['.ui-panel-content-skills-vertical > div',
          '.ui-panel-content-skills > div > div', '.ui-panel-content-skills > :nth-child(2)',
          '.skip-button', '.continue-button', '.advance-button'
        ]
        for (const path of paths) {
          const element = document.querySelector(path);
          if (!element) continue;
          if (path === '.ui-panel-content-skills > div > div') {
            if (element.textContent === `Let's Fight!` && Game.getSetting('acceptMB')) element.click();
            else if (element.textContent === 'Creator Bonus: Increase Coin Earn Rate by 10% ' && !Game.getSetting('creatorAtkBonus')) element.click();
            else if (element.textContent === `Yes` && Game.getSetting('acceptHut')) element.click();
            else if (element.textContent.includes('but') && Game.getSetting('acceptSB')) element.click();
            else continue;
          }
          else element.click();
          if (path === '.continue-button') {
            clearInterval(Autoplayer.#loop);
            const pauseBtn = document.querySelector('.pause-button');
            if (pauseBtn) {
              pauseBtn.remove();
            }
          }
          break;
        }
      }, 200);
      console.log('[Frog Assistant] Autoplay started...');
    }

    /**
     * Stops the autoplay.
     */
    static #stopAutoplay() {
      if (Autoplayer.#loop !== null) {
        clearInterval(Autoplayer.#loop);
        Autoplayer.#loop = null;
        Autoplayer.#inProgress = false;
        console.log('[Frog Assistant] Autoplay stopped.');
      }
    }

    /**
     * Starts the autoplay process.
     */
    static start() {
      if (Autoplayer.#inProgress) return;
      Autoplayer.#inProgress = true;
      window.addEventListener('message', (event) => {
        if (event.origin === 'https://www.reddit.com' && event.data.type) {
          if (event.data.type === 'startAutoplayRequest' && event.data.data && event.data.data.allowed) {
            console.log('[Frog Assistant] Received startAutoplayRequest from Autobrowser.');
            BotUtils.waitForSelector(document, '.pause-button')
              .then((btn) => btn.click())
              .catch((err) => console.error(err));
          }
        }
      });
      Autoplayer.#postMessage({ type: 'startAutoplayRequest' });
      BotUtils.waitForSelector(document, '.ui-top-bar')
        .then(() => {
          Autoplayer.#injectPauseBtn();
        })
        .catch((err) => console.error(err));
      BotUtils.waitForSelector(document, '.pause-button')
        .then((btn) => {
          if (Game.getSetting('autoStart')) {
            btn.click();
          }
        });
    }
  }

  /**
   * A bot that browse missions automatically.
   */
  class Autobrowser {
    /** @readonly */
    static CURRENT_MISSION_ID_KEY = 'currentMissionID';

    /** @readonly */
    static CURRENT_MISSION_STATUS_KEY = 'currentMissionStatus';

    /** @type {Element[]} The list of missions to be played. */
    static #missionQueue;

    /** @type {Element} The current mission the bot is processing. */
    static #currentMission;

    /** @type {boolean} Indicates whether the bot is currently working. */
    static #inProgess = false;

    /** @type {RegExp} The regular expression to match user profile URLs. */
    static #userProfileRegex = /^https:\/\/www\.reddit\.com\/user\/[\w\-]+\/submitted\/$/;

    /** @type {string | null} The channel id. */
    static #channel = null;

    /** @type {WindowProxy | null} */
    static #openedWindow = null;

    /**
     * @param {HTMLElement} missionElement 
     */
    static #setCurrentMission(missionElement) {
      Autobrowser.#currentMission = missionElement;
      if (Autobrowser.#currentMission && Autobrowser.#channel !== null) {
        const missionId = missionElement.querySelector('a[href^="/r/SwordAndSupperGame/comments/"]').href.match(Game.MISSION_ID_MATCHER);
        GM_setValue(`${Autobrowser.#channel}_${Autobrowser.CURRENT_MISSION_ID_KEY}`, missionId);
        GM_setValue(`${Autobrowser.#channel}_${Autobrowser.CURRENT_MISSION_STATUS_KEY}`, 'waiting');
      }
    }

    /**
     * Starts browsing and entering missions.
     */
    static #startRunningMissions() {
      Autobrowser.#findMissions();
      Autobrowser.#startNextMission()
    }

    /**
     * Finds all available missions.
     */
    static #findMissions() {
      const missions = document.querySelectorAll('shreddit-post');
      Autobrowser.#missionQueue = [...missions];
    }

    /**
     * Enters the current mission.
     */
    static #startCurrentMission() {
      if (!Autobrowser.#currentMission) return;
      Autobrowser.#currentMission.querySelector('div').scrollIntoView();
      Autobrowser.#getCurrentMissionOverview()
        .then(async (overview) => {
          if (Autobrowser.#isMissionInn(overview)) {
            console.log('[Frog Assistant] Mission is an inn.');
            Autobrowser.#startNextMission();
            return;
          }
          console.log('[Frog Assitant] Opening a new tab for the game.');
          Autobrowser.#openedWindow = unsafeWindow.open(Autobrowser.#currentMission.querySelector('a[href^="/r/SwordAndSupperGame/comments/"]').href);
        })
        .catch((error) => {
          console.error('Failed to get mission overview. Skipping to next mission. Reason: ', error);
          Autobrowser.#startNextMission();
        });
    }

    /**
     * Gets the mission overview data for the current mission.
     * @returns {Promise<Element>} The element that contains all the mission overview data.
     */
    static async #getCurrentMissionOverview() {
      if (Autobrowser.#currentMission === undefined) {
        throw new Error('No current mission selected.');
      }
      return await Game.getMissionOverview(Autobrowser.#currentMission);
    }

    /**
     * Moves on to the next mission in the {@link #missionQueue}
     * @returns {Promise<boolean>} A promise of true if the successful and false when there's no more missions in the queue.
     */
    static async #moveToNextMission() {
      Autobrowser.#setCurrentMission(Autobrowser.#missionQueue.shift());
      if (!Autobrowser.#currentMission) return false;
      if (Autobrowser.#missionQueue.length === 0) {
        Autobrowser.#currentMission.scrollIntoView();
        await BotUtils.wait(1000);
        Autobrowser.#findMissions();
        Autobrowser.#skipToMission(Autobrowser.#currentMission);
        if (Autobrowser.#missionQueue.length === 0) return false;
        Autobrowser.#setCurrentMission(Autobrowser.#missionQueue.shift());
      }
      return true;
    }

    /**
     * Starts the next mission in the {@link #missionQueue}
     */
    static #startNextMission() {
      console.log('[Frog Assistant] Starting the next mission...');
      Autobrowser.#moveToNextMission()
        .then((result) => {
          if (result) {
            console.log('[Frog Assistant] Found the next mission...');
            Autobrowser.#startCurrentMission();
          }
          else {
            Autobrowser.#inProgess = false;
            console.log('[Frog Assistant] No more missions available. Autobrowser stopped.');
          }
        })
    }

    /**
     * Finds {@link mission} in {@link #missionQueue} and skips to it.
     * @param {Element} mission The mission element to skip to. 
     */
    static #skipToMission(mission) {
      if (!mission) throw new Error('Invalid mission.')
      if (Autobrowser.#missionQueue.length === 0) return;
      const lastMisssionId = mission.querySelector('shreddit-post > a[slot="full-post-link"]')?.getAttribute('data-ks-id')
      const newLastMissionId = Autobrowser.#missionQueue[Autobrowser.#missionQueue.length - 1].querySelector('shreddit-post > a[slot="full-post-link"]')?.getAttribute('data-ks-id');
      if (lastMisssionId && newLastMissionId && lastMisssionId === newLastMissionId) {
        Autobrowser.#missionQueue = [];
        return;
      }
      // Find the index of the last map that was played.
      const skipTo = Autobrowser.#missionQueue.findIndex((el) => {
        const missionId = el.querySelector('shreddit-post > a[slot="full-post-link"]').getAttribute('data-ks-id');
        return missionId && lastMisssionId === missionId;
      });
      if (skipTo == -1) throw new Error('Unable to relocated mission in the mission queue.');
      Autobrowser.#missionQueue = Autobrowser.#missionQueue.slice(skipTo + 1);
    }

    /**
     * Checks if a mission goes to the Inn.
     * @param {Element} missionOverview Mission overview data element.
     * @returns {boolean} True if the mission goes to the Inn and false otherwise.
     */
    static #isMissionInn(missionOverview) {
      const imgSrc = missionOverview.querySelector('div.cursor-pointer[data-block-type="image"] > img').getAttribute('src');
      return imgSrc !== 'https://i.redd.it/3kg6d3isvyre1.png';
    }

    static #generateChannel() {
      const channelPrefix = 'autobrowserChannel';
      for (let i = 0; i < 4; i++) {
        const channelName = channelPrefix + i;
        const channelTimestamp = GM_getValue(channelName, null);
        const timestamp = Date.now();
        if (channelTimestamp === null || Date.now() - channelTimestamp > 2 * 60 * 1000) {
          GM_setValue(channelName, timestamp);
          setInterval(() => {
            GM_setValue(channelName, Date.now());
          }, 60 * 1000);
          return channelName;
        }
      }
      throw new Error('All channels have been occupied.');
    }

    /**
     * Starts auto-browsing.
     */
    static start() {
      if (Autobrowser.#inProgess) return;
      Autobrowser.#inProgess = true;
      Autobrowser.#missionQueue = [];
      Autobrowser.#currentMission = undefined;
      Autobrowser.#channel = Autobrowser.#generateChannel();
      Autobrowser.#startRunningMissions();
      GM_addValueChangeListener(`${Autobrowser.#channel}_${Autobrowser.CURRENT_MISSION_STATUS_KEY}`, (key, oldValue, newValue, remote) => {
        if (newValue === 'completed') {
          console.log('[Frog Assistant] Received complete signal from MissionStart. Starting the next mission!');
          Autobrowser.#openedWindow.close();
          Autobrowser.#openedWindow = null;
          Autobrowser.#startNextMission();
        }
      });
      console.log('[Frog Assistant] Autobrowser started!');
    }

    /**
     * Injects a button to start autobrowsing.
     */
    static injectUIElements() {
      const path = Autobrowser.#userProfileRegex.test(window.location.href) ?
        'shreddit-async-loader[bundlename="shreddit_sort_dropdown"] > div' :
        '.masthead > section > div > div:nth-child(2)';
      const btnWrapper = document.querySelector(path);
      if (!btnWrapper || btnWrapper.querySelector('a.autoplay')) return;
      const autoplayBtn = document.createElement('a');
      autoplayBtn.setAttribute('class', 'autoplay button button-primary button-medium px-[var(--rem14)]');
      autoplayBtn.innerHTML = 'Start Autoplay';
      btnWrapper.prepend(autoplayBtn);
      autoplayBtn.addEventListener('click', () => {
        if (!Autobrowser.#inProgess) {
          Autobrowser.start();
          autoplayBtn.classList.add('disabled');
          autoplayBtn.textContent = 'Autobrowser Started';
        }
      });
    }
  }

  class Game {
    static MISSION_URL_MATCHER = /https:\/\/www.reddit.com\/r\/SwordAndSupperGame\/comments\/[\w]+\//g;
    static MISSION_ID_MATCHER = /(?<=https:\/\/www.reddit.com\/r\/SwordAndSupperGame\/comments\/|https:\/\/www.reddit.com\/r\/SwordAndSupper\/comments\/)[\w]+/g;

    /** @type {Map<string, GameSetting>} The settings of the autoplayer */
    static SETTINGS = new Map(Object.entries({
      autoStart: {
        name: 'Autostart',
        type: 'checkbox',
        escape: (value) => { return value },
        default: false,
        value: null
      },
      acceptSB: {
        name: 'Accept Skill Bargains',
        type: 'checkbox',
        escape: (value) => { return value },
        default: false,
        value: null
      },
      acceptMB: {
        name: 'Accept Miniboss',
        type: 'checkbox',
        escape: (value) => { return value },
        default: true,
        value: null
      },
      acceptHut: {
        name: 'Accept Hut',
        type: 'checkbox',
        escape: (value) => { return value },
        default: false,
        value: null
      },
      maxEquip: {
        name: 'Max Equipment #',
        type: 'number',
        escape: (value) => { return Math.max(value, 1) },
        default: 1,
        value: null
      },
      maxBP: {
        name: 'Max Blueprint #',
        type: 'number',
        escape: (value) => { return Math.max(value, 1) },
        default: 1,
        value: null
      },
      maxMap: {
        name: 'Max Map #',
        type: 'number',
        escape: (value) => { return Math.max(value, 1) },
        default: 300,
        value: null
      },
      animationSpeed: {
        name: 'Animation Speed',
        type: 'number',
        escape: (value) => { return Math.max(value, 1) },
        default: 1,
        value: null
      },
      missionBatchSize: {
        name: 'Mission Batch Size',
        type: 'number',
        escape: (value) => { return Math.max(value, 1) },
        default: 10,
        value: null
      },
      creatorAtkBonus: {
        name: 'Prefer creator attack bonus',
        type: 'checkbox',
        escape: (value) => { return value },
        default: false,
        value: null
      }
    }));

    /** @type {Map<ItemRarity, ItemRarityColor>} */
    static RARITY_COLOR = new Map(Object.entries({
      common: {
        color: '#718E99',
        altColor: '#233941ff'
      },
      uncommon: {
        color: '#35D934',
        altColor: '#009233ff'
      },
      rare: {
        color: '#2ABFFF',
        altColor: '#016597ff'
      },
      epic: {
        color: '#C880FE',
        altColor: '#632294ff'
      },
      legendary: {
        color: '#FFDE01',
        altColor: '#917e00ff'
      },
      mythic: {
        color: '#FD464B',
        altColor: '#970008ff'
      }
    }));

    /** @type {ItemData[]} */
    static ITEMS = [];

    /**
     * Injects elements into the settings menu.
     */
    static injectSettings() {
      const menu = document.querySelector('.settings-content');
      const heading = document.createElement('h3');
      const wrapper = document.createElement('div');
      const reference = document.querySelector('.settings-credits-text');
      wrapper.classList.add('settings-credits-text');
      wrapper.classList.add('assistant-settings');
      heading.textContent = 'Frog Assistant Settings';
      wrapper.append(heading);
      Game.SETTINGS.keys().forEach((settingKey) => {
        const setting = Game.SETTINGS.get(settingKey);
        const settingWrapper = document.createElement('div');
        const label = document.createElement('label');
        const input = document.createElement('input');
        input.classList.add('settings-input');
        input.id = settingKey;
        switch (setting.type) {
          case 'number':
            input.type = 'number'
            input.value = Game.getSetting(settingKey);
            input.addEventListener('change', () => {
              const escapedValue = setting.escape(input.value);
              input.value = escapedValue;
              Game.setSetting(settingKey, escapedValue);
            })
            break;
          case 'checkbox':
            input.type = 'checkbox'
            input.checked = Game.getSetting(settingKey);
            input.addEventListener('change', () => {
              Game.setSetting(settingKey, input.checked);
            })
            break;
        }
        label.textContent = `${setting.name}: `;
        settingWrapper.append(label);
        settingWrapper.append(input);
        wrapper.append(settingWrapper);
      });
      menu.insertBefore(wrapper, reference);
    }

    /**
     * Saves a value to local storage with the key {@link settingKey}.
     * Available keys: acceptSB, acceptMB, acceptHut
     * @param {string} settingKey The name of the key.
     * @param {any} value The value to be set.
     */
    static setSetting(settingKey, value) {
      const setting = Game.SETTINGS.get(settingKey);
      if (!setting) {
        throw new Error(`${settingKey} is not a valid setting`);
      }
      GM_setValue(settingKey, value);
      setting.value = value;
    }

    /**
     * Retrives the value from local storage with the key {@link settingKey}.
     * Available keys: acceptSB, acceptMB, acceptHut
     * @param {string} settingKey The name of the key.
     * @returns {any} The value stored in local storage.
     */
    static getSetting(settingKey) {
      const setting = Game.SETTINGS.get(settingKey);
      if (!setting) {
        throw new Error(`${settingKey} is not a valid setting`);
      }
      if (setting.value === null) {
        let value = GM_getValue(settingKey, null);
        if (value === null) {
          Game.setSetting(settingKey, setting.default);
          value = setting.default;
        }
        setting.value = value;
      }
      return setting.value;
    }

    /**
     * Resets all current settings to default.
     */
    static resetDefaultSettings() {
      Game.SETTINGS.keys().forEach(key => {
        const settings = Game.SETTINGS.get(key);
        Game.setSetting(key, settings.default);
      })
    }

    /**
     * Create an item modal overlay.
     * @param {Function} onOverlayClose The callback function when the overlay is closed.
     * @returns {HTMLElement} The created overlay element.
     */
    static createBlankItemModalOverlay(onOverlayClose) {
      if (document.querySelector('.item-modal-overlay')) {
        throw new Error('Item modal overlay already exists.');
      }
      const overlay = document.createElement('div');
      overlay.classList.add('item-modal-overlay');
      document.querySelector('#equipment-modal-container').append(overlay);

      const contentWrapper = document.createElement('div');
      contentWrapper.classList.add('item-modal-content');
      contentWrapper.classList.add('shown');
      overlay.append(contentWrapper);

      const dismissBtn = document.createElement('button');
      dismissBtn.classList.add('item-modal-dismiss-button');
      dismissBtn.addEventListener('click', () => {
        onOverlayClose();
        overlay.remove();
      });
      contentWrapper.append(dismissBtn);

      const dismissIcon = document.createElement('img');
      dismissIcon.src = 'assets/ui/button_close_corner.png';
      dismissIcon.alt = 'Close';
      dismissBtn.append(dismissIcon);

      return overlay;
    }

    /**
     * Create an item modal overlay with a specific title.
     * @param {string} title The title of the menu.
     * @param {Function} onOverlayClose The callback function when the overlay is closed.
     * @returns {HTMLElement} The created overlay element.
     */
    static createTitledItemModalOverlay(title, onOverlayClose) {
      const overlay = Game.createBlankItemModalOverlay(onOverlayClose);
      const content = overlay.querySelector('.item-modal-content');
      const itemModalHeader = document.createElement('div');
      itemModalHeader.classList.add('item-modal-header');
      itemModalHeader.classList.add('custom-menu-header');
      itemModalHeader.style = 'background: radial-gradient(circle, rgb(47, 148, 252) 0%, rgb(74, 92, 225) 100%); padding-bottom: 1rem;';
      const headerTitleWrapper = document.createElement('div');
      const headerTitle = document.createElement('h2');
      headerTitleWrapper.classList.add('item-title');
      headerTitle.textContent = title;
      headerTitleWrapper.append(headerTitle);
      itemModalHeader.append(headerTitleWrapper);
      content.append(itemModalHeader);
      return overlay;
    }

    /**
     * Gets all the items in the game.
     * @returns {ItemData[]} The list of item data.
     */
    static async queryItems() {
      const data = await (await fetch('https://cabbageidle-eimoap-0-0-51-webview.devvit.net/assets/index-D8w2wnbY.js')).text();
      const reg = /{name:"[^"]*",((description:"[^"]*",?)|(rarity:"[^"]*",?)|(assetName:"[^"]*",?)|(equipSlots:\[("[^"]*",?)*\],?)|(damage:{[^}]*},?)|(statModifiers:\[[^\]]*\],?)|(abilities:\[[^\]]*\],?)|(requiredLevel:[\d]+,?)|(sellPrice:[\de]+,?)|(upgrades:\[{requires:\[({id:"[^"]*",amount:[\de]+},?)+\],yields:"[^"]*"}\],?)|(tags:\[("[^"]*",?)*\])|(isStackable:!0,?))*}/g;
      const itemStrings = data.match(reg);
      const parse = (str) => {
        str = str.replaceAll(/[{,]\w+:/g, (match) => {
          return `${match[0]}"${match.substring(1, match.length - 1)}"${match[match.length - 1]}`
        });
        str = str.replaceAll(/[^\d]\.[\d]+/g, (match) => {
          return `${match[0]}0${match.substring(1)}`
        });
        str = str.replaceAll(/!0/g, 'true');
        return str;
      }
      return itemStrings.map((itemString) => JSON.parse(parse(itemString)));
    }

    /**
     * Gets the mission overview element.
     * @param {HTMLElement} postElement
     * @returns {Promise<HTMLElement>} The mission overview element.
     */
    static async getMissionOverview(postElement) {
      const maxWaitTime = 10000;
      let overview = undefined;
      for (let timeSpent = 0; timeSpent <= maxWaitTime; timeSpent += 500) {
        overview = postElement.querySelector('shreddit-devvit-ui-loader')?.shadowRoot
          ?.querySelector('devvit-surface')?.shadowRoot?.querySelector('devvit-blocks-renderer')?.shadowRoot;
        if (overview) return overview;
        await BotUtils.wait(500);
      }
      throw new Error('Timed out while waiting for mission overview to load.');
    }
  }

  class MissionStarter {
    /** @type {string | null} */
    static #channel = null

    static #listenForCompletion() {
      window.addEventListener('message', (event) => {
        if (event.origin.startsWith('https://cabbageidle-eimoap') && event.data.type) {
          if (event.data.type === 'missionCleared') {
            console.log('[Frog Assistant] Mission completed! Notifying autobrowser to start the next mission.');
            BotUtils.wait(2000).then(() => GM_setValue(`${MissionStarter.#channel}_${Autobrowser.CURRENT_MISSION_STATUS_KEY}`, 'completed'));
          } else if (event.data.type === 'startAutoplayRequest') {
            console.log('[Frog Assistant] Autoplay request found. Giving autoplayer the approvol to start.')
            MissionStarter.#postMessage({ type: 'startAutoplayRequest', data: { allowed: true } })
          }
        }
      });
    }

    /**
     * Sends a message to the Autoplayer.
     * @param {any} message The message to the Autoplayer.
     */
    static #postMessage(message) {
      const gameContainer = document.querySelector('rpl-modal-card devvit-blocks-web-view');
      if (!gameContainer) {
        throw new Error('Unable to find game container.');
      }
      const iframe = gameContainer.shadowRoot.querySelector('iframe');
      if (!iframe) {
        throw new Error('Unable to find game iframe.');
      }
      const src = iframe.getAttribute('src').match(/https:\/\/cabbageidle-eimoap-[0-9]+-[0-9]+-[0-9]+-webview.devvit.net/)[0];
      iframe.contentWindow.postMessage(message, src);
    }

    static #enterGame() {
      Game.getMissionOverview(document.querySelector('shreddit-post'))
        .then(async (overview) => {
          console.log('[Frog Assistant] Attempting to enter the game.');
          let modalCard;
          for (let i = 0; i < 10; i++) {
            overview.querySelector('div > div > div > div')?.click();
            modalCard = document.querySelector('rpl-modal-card');
            if (modalCard) {
              console.log('[Frog Assistant] Game entered successfully!');
              break;
            }
            await BotUtils.wait(1000);
          }
          if (!modalCard) throw new Error('Unable to open the game.');
        });
    }

    static start() {
      /** @type {string[]} */
      const keys = GM_listValues();
      const missionId = window.location.href.match(Game.MISSION_ID_MATCHER)[0];
      let missionIdKey = null;
      for (const key of keys) {
        if (!key.startsWith('autobrowserChannel') || !key.endsWith(Autobrowser.CURRENT_MISSION_ID_KEY)) continue;
        const id = GM_getValue(key, '');
        if (id[0] === missionId) {
          missionIdKey = key;
          break;
        }
      }
      if (!missionIdKey) {
        console.log('[Frog Assistant] Unable to find autobrowser channel. Mission will not auto start.');
        return;
      }
      MissionStarter.#channel = missionIdKey.split('_')[0];
      if (Date.now() - GM_getValue(MissionStarter.#channel, Date.now()) <= 2 * 60 * 1000) {
        console.log('[Frog Assitant] Found autobrowser channel. Starting mission automatically...');
        MissionStarter.#enterGame();
        MissionStarter.#listenForCompletion();
      }
    }
  }

  function main() {
    if (Game.MISSION_URL_MATCHER.test(window.location.href)) {
      MissionStarter.start();
    } else if (window.location.hostname === 'www.reddit.com') {
      if (window.navigation) {
        window.navigation.addEventListener('navigatesuccess', () => {
          Autobrowser.injectUIElements();
        });
      }
      Autobrowser.injectUIElements();
    } else {
      // Swap out necessary functions to manipulate animation speed.
      FastPerformance.swap();
      FastDate.swap();
      CustomRequestAnimationFrame.swap();

      Autoplayer.start();

      // Inject sell dupe button.
      BotUtils.waitForSelector(document, '.sort-controls')
        .then((el) => {
          DupeSeller.injectUIElements(el);
          MissionCreator.injectUIElements(el);
        });

      // Inject settings menu.
      BotUtils.waitForSelector(document, '.settings-content')
        .then(() => {
          Game.injectSettings();
        })
        .catch((err) => console.error(err));

      // Query game items.
      Game.queryItems()
        .then((items) => {
          Game.ITEMS = items;
        })
    }
  }

  main();
})();
