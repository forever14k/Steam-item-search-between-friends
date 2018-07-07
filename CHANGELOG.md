1.3.7 / 2018-07-07
==================
- Fix extension not working if slash at the end of path

1.3.6 / 2018-07-05
==================
- Enable extension on blocked and following friends page

1.3.5 / 2018-06-13
==================
- Quick fix for new Steam friends UI

1.3.4 / 2018-01-11
==================
- Adjust Steam request per minute limit. Now its 30, was 150.

1.3.3 / 2018-01-09
==================
- Change title and description as requested by chrome web store dev. support.

1.3.2 / 2017-01-03
==================
- Fixed persons selector for authed steam users.

1.3.1 / 2016-12-21
==================
- Fixed search text replaced when inventories load too fast.

1.3.0 / 2016-12-19
==================
- Change Steam inventory end point.
- Adjust Steam request per minute limit. Now its 150, was 2.
- Minor fixes, such as gems regexes.

1.2.2 / 2016-12-15
==================
- Adjust Steam request per minute limit. Now its 2, was 13.
- Added console info message
- Disabled Debug

1.2.1 / 2016-11-22
==================
- Added market_name fallback using name

1.2.0 / 2016-06-28
==================
- Major Update
  - Reworked code base
  - Extensibility
  - Bundling
  - No more eye bleeding
- Now using
  - CoffeeScript, Jade, Stylus
  - Redux
  - Async\Queue, Lodash
  - Grunt

1.1.6 / 2016-07-02
==================
- Fixed crash if items don't have description.

1.1.5 / 2016-06-02
==================
- Using https protocol (if requested over https).

1.1.4 / 2015-09-16
==================
- Increased Steam calls timeout due to Steam updates (4300ms).

1.1.3 / 2015-01-07
==================
- Increased Steam calls timeout due to Steam updates (2100ms).

1.1.2 / 2014-09-05
==================
- Fixed Slot filters not showing.

1.1.1
==================
- Fixed not showing results if item don't had tags.

1.1.0
==================
- Reworked previous change for smoother experience.

1.0.9
==================
- Steam now limits API call per minute, so if Steam blocked us - we wait one minute for gaining access.

1.0.8
==================
- Fixed incidental error. :)

1.0.7
==================
- Added UI for filters.
- Filters in input box is no longer available.

1.0.6
==================
- Fixed URL pattern match caused extension don't work if no slash in the end of URL.

1.0.5
==================
- Fixed incidental error.

1.0.4
==================
- Fixed unusual tooltips for Team Fortress 2.

1.0.3
==================
- Enabled unusual tooltips.
- Added gems support.
- Updated tournament tooltips.
- Added rarity filters for community inventories (753,6).
- Updated qualities for Dota 2 (Vintage -> Elder, Tournament ->Heroic, Haunted -> Cursed, Strange -> Inscribed).

1.0.2
==================
- Fixed quality and rarity filters.
- Disabled unusual tooltips for now (gems update).

1.0.1
==================
- Added Counter-Strike: Global Offensive filters such as: exterior:<exterior>, category:<category>, quality:<quality>.
