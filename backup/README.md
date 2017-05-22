# Steam item search between friends
This extension allows to find items you looking for in all friends inventories on the same time. (On Steam friends page e.g. https://steamcommunity.com/my/friends)

## Extension allows filtering results like:
* **Quality** - Unique, Limited, Genuine, Vintage, Unusual, Heroic, etc..
* **Status** - Tradable, Marketable, Gifted, Crafted, Clean, Renamed, etc...
* **Rarity** - Common, Uncommon, Rare, Mythical, Legendary, etc...
* **Hero** - Sven, Ursa, Drow Ranger, Omniknight (:D), Witch Doctor, etc...
* **Type** - Craft item, Weapon, Building, Tool, Cosmetic, etc...
* **Class** - Demoman, Scout, Pyro, Spy, Sniper, etc...
* **And many more...**

## **How To:** Find appid and contextid for game items you looking for.
1. Open any inventory in chrome.
2. Select game inventory that you need. (for example, "Steam" inventory)
3. Choose items category if you need to. (for example, "Coupons")
4. Refresh or open now steam friends page in chrome.
5. **Thats it.** Now extension grab updated ids and show them up in input boxes. You can now load inventories and search items you looking for.

In my opinion, Steam trading system lack of such a functionality.

## **How To:** Install from Chrome Web Store (using Chrome).
1. Open [extension page in Chrome Web Store](https://chrome.google.com/webstore/detail/steam-item-search-between/ajlddciniccidokpjhppahkoefohkchg).
2. Click ADD TO CHROME button.
3. Click Install extension in Chrome popup window. Thats it.

Now you can open your Steam friends page (e.g. https://steamcommunity.com/my/friends) and start using extension.

## **How to:** Install local copy (using Chrome).
1. Install [Node.js](https://nodejs.org)
2. Install [CoffeeScript](http://coffeescript.org/) and [Grunt](http://gruntjs.com/)
```
npm install -g coffee-script
npm install -g grunt-cli
```
3. Install Steam item search between friends
```
git clone git@github.com:forever14k/Steam-item-search-between-friends.git
cd Steam-item-search-between-friends
npm install
```
4. Build Steam item search between friends extension
```
grunt build
```
5. Open [Chrome extensions page](chrome://extensions/)
6. Tick Developer mode checkbox
7. Click Load unpacked extension...
8. Select Steam-item-search-between-friends/build directory, and click OK

Now you can open your Steam friends page (e.g. https://steamcommunity.com/my/friends) and start using extension.

# [Changelog](/CHANGELOG.md)
