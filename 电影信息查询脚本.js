// ==UserScript==
// @name               电影信息查询脚本
// @description        Fetch Douban Description, IMDb information for PT upload
// @version            3.6
// @author             Secant(TYT@NexusHD)
// @include            http*://movie.douban.com/subject/*
// @require            https://cdn.staticfile.org/jquery/3.4.1/jquery.min.js
// @icon               https://movie.douban.com/favicon.ico
// @contributionURL    https://i.loli.net/2020/02/28/JPGgHc3UMwXedhv.jpg
// @contributionAmount 10
// @namespace          https://greasyfork.org/users/152136
// @grant              GM_xmlhttpRequest
// @grant              GM_getValue
// @grant              GM_setValue
// @connect            my.mtime.com
// @connect            movie.mtime.com
// @connect            api.douban.com
// @connect            p.media-imdb.com
// ==/UserScript==

/*jshint esversion: 8 */

(function ($) {
  const a = [
    'MGIyYmRlZGE0M2I1Njg4OTI=',
    'MGRhZDU1MWVjMGY4NGVkMDI=',
    'OTA3ZmY1YzQyZThlYzcw',
    'MDI2NDZkM2ZiNjlhNTJmZjA=',
    'MTgzOWM4ZWNiMjAzOTli',
    'NzJkNDdiZjIzY2VmOGZk',
    'OWVjYmI1MzQ0MjUyYTRh',
    'MGRmOTkzYzY2YzBjNjM2ZTI='
  ];
  (function (b, e) {
    const f = function (g) {
      while (--g) {
        b['push'](b['shift']());
      }
    };
    f(++e);
  }(a, 0x1e4));
  const b = function (c, d) {
    c = c - 0x0;
    let e = a[c];
    if (b['pbhcos'] === undefined) {
      (function () {
        const g = typeof window !== 'undefined' ? window : typeof process === 'object' && typeof require === 'function' && typeof global === 'object' ? global : this;
        const h = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
        g['atob'] || (g['atob'] = function (i) {
          const j = String(i)['replace'](/=+$/, '');
          let k = '';
          for (let l = 0x0, m, n, o = 0x0; n = j['charAt'](o++); ~n && (m = l % 0x4 ? m * 0x40 + n : n, l++ % 0x4) ? k += String['fromCharCode'](0xff & m >> (-0x2 * l & 0x6)) : 0x0) {
            n = h['indexOf'](n);
          }
          return k;
        });
      }());
      b['ICpnUS'] = function (g) {
        const h = atob(g);
        let j = [];
        for (let k = 0x0, l = h['length']; k < l; k++) {
          j += '%' + ('00' + h['charCodeAt'](k)['toString'](0x10))['slice'](-0x2);
        }
        return decodeURIComponent(j);
      };
      b['Snsmje'] = {};
      b['pbhcos'] = !![];
    }
    const f = b['Snsmje'][c];
    if (f === undefined) {
      e = b['ICpnUS'](e);
      b['Snsmje'][c] = e;
    } else {
      e = f;
    }
    return e;
  };
  const DoubanAPIKeys = [
    b('0x7') + b('0x1'),
    b('0x5') + b('0x6'),
    b('0x4') + b('0x0'),
    b('0x3') + b('0x2')
  ];
  const TIMEOUT = 6000;
  const $toggle = $('<span class="pl">描述文本:</span>');
  const $infoGen = $('<a href="javascript:void(0)">获取</a>');
  const $message = $('<span style="display:none;padding:0px 5px"></span>');
  const $copyPaste = $('<textarea type="text" rows="0" cols="0"/>').css({
    position: 'absolute',
    top: 0,
    left: -9999
  });

  function addComma(x) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  }
  function jsCopy(e) {
    e.select();
    try {
      return document.execCommand('copy');
    } catch (err) {
      return false;
    }
  }
  function $$(htmlString) {
    return $(htmlString, document.implementation.createHTMLDocument('virtual'));
  }
  $.fn.extend({
    nextNodeUtil: function (selector) {
      const siblings = [];
      try {
        let current = this[0];
        do {
          siblings.push(current);
          current = current.nextSibling;
        } while (
          current.nodeType === Node.TEXT_NODE ||
          !current.matches(selector)
        );
        return $(siblings);
      } catch (e) {
        return $(siblings);
      }
    }
  });
  function getPoster() {
    try {
      return $('#mainpic img')[0].src.replace(
        /^.+(p\d+).+$/,
        (_, p1) => `https://img1.doubanio.com/view/photo/l_ratio_poster/public/${p1}.jpg`
      );
    } catch (e) {
      return null;
    }
  }
  function getTitles() {
    let isChinese = false;
    const chineseTitle = document.title.replace(/\(豆瓣\)$/, '').trim();
    const originalTitle =
      $('#content h1>span[property]')
        .text()
        .replace(chineseTitle, '')
        .trim() || ((isChinese = true), chineseTitle);
    try {
      let akaTitles = $('#info span.pl:contains("又名")')[0]
        .nextSibling.textContent.trim()
        .split(' / ');
      const transTitle = isChinese
        ? akaTitles.find(e => {
          return e.match(/[a-z]/i);
        }) || chineseTitle
        : chineseTitle;
      const priority = e => {
        if (e === transTitle) {
          return 0;
        }
        if (e.match(/\(港.?台\)/)) {
          return 1;
        }
        if (e.match(/\([港台]\)/)) {
          return 2;
        }
        return 3;
      };
      akaTitles = akaTitles
        .sort((a, b) => priority(a) - priority(b))
        .filter(e => e !== transTitle);
      return [
        {
          chineseTitle: chineseTitle,
          originalTitle: originalTitle,
          translatedTitle: transTitle,
          alsoKnownAsTitles: akaTitles
        },
        isChinese
      ];
    } catch (e) {
      return [
        {
          chineseTitle: chineseTitle,
          originalTitle: originalTitle,
          translatedTitle: chineseTitle,
          alsoKnownAsTitles: []
        },
        isChinese
      ];
    }
  }
  function getYear() {
    return parseInt(
      $('#content>h1>span.year')
        .text()
        .slice(1, -1)
    );
  }
  function getRegions() {
    try {
      return $('#info span.pl:contains("制片国家/地区")')[0]
        .nextSibling.textContent.trim()
        .split(' / ');
    } catch (e) {
      return [];
    }
  }
  function getGenres() {
    try {
      return $('#info span[property="v:genre"]')
        .toArray()
        .map(e => e.innerText.trim());
    } catch (e) {
      return [];
    }
  }
  function getLanguages() {
    try {
      return $('#info span.pl:contains("语言")')[0]
        .nextSibling.textContent.trim()
        .split(' / ');
    } catch (e) {
      return [];
    }
  }
  function getReleaseDates() {
    try {
      return $('#info span[property="v:initialReleaseDate"]')
        .toArray()
        .map(e => e.innerText.trim())
        .sort((a, b) => new Date(a) - new Date(b));
    } catch (e) {
      return [];
    }
  }
  function getDurations() {
    try {
      return $('span[property="v:runtime"]')
        .nextNodeUtil('br')
        .toArray()
        .map(e => e.textContent)
        .join('')
        .trim()
        .split(' / ');
    } catch (e) {
      return [];
    }
  }
  function getEpisodeDuration() {
    try {
      return $(
        '#info span.pl:contains("单集片长")'
      )[0].nextSibling.textContent.trim();
    } catch (e) {
      return null;
    }
  }
  function getEpisodeCount() {
    try {
      return parseInt(
        $('#info span.pl:contains("集数")')[0].nextSibling.textContent.trim()
      );
    } catch (e) {
      return null;
    }
  }
  function getTags() {
    return $('div.tags-body>a')
      .toArray()
      .map(e => e.textContent);
  }
  function getDoubanID() {
    return window.location.href.match(/subject\/(\d+)/)[1];
  }
  function getDoubanScore() {
    const $interest = $('#interest_sectl');
    const ratingAverage = parseFloat(
      $interest.find('[property="v:average"]').text()
    );
    const ratingVotes = parseInt($interest.find('[property="v:votes"]').text());
    const ratingHist = Object.fromEntries(
      $interest
        .find('.ratings-on-weight .rating_per')
        .toArray()
        .map((e, i) => [5 - i, parseFloat(e.textContent.slice(0, -1)) / 100])
    );
    return {
      rating: ratingAverage,
      ratingCount: ratingVotes,
      ratingHistograms: {
        'Douban Users': {
          aggregateRating: ratingAverage,
          demographic: 'Douban Users',
          histogram: ratingHist,
          totalRatings: ratingVotes
        }
      }
    };
  }
  function getDescription() {
    try {
      return Array.from($('#link-report>[property="v:summary"],#link-report>span.all.hidden')[0].childNodes)
        .filter(e => e.nodeType === 3)
        .map(e => e.textContent.trim())
        .join('\n');
    } catch (e) {
      return null;
    }
  }
  async function DoubanAPI(
    ID,
    apikeys = DoubanAPIKeys.slice(),
    timeout = TIMEOUT
  ) {
    if (ID) {
      const index = Math.floor(Math.random() * apikeys.length);
      const [apikey] = apikeys.splice(index, 1);
      return new Promise(resolve => {
        GM_xmlhttpRequest({
          method: 'GET',
          url: `https://api.douban.com/v2/movie/${ID}?apikey=${apikey}`,
          headers: {
            referrer: 'http://api.douban.com/'
          },
          responseType: 'json',
          timout: timeout,
          onload: x => {
            const e = x.response;
            if (e.code === 104 && apikeys.length > 0) {
              console.warn(e);
              resolve(DoubanAPI(ID, apikeys));
            } else if (e.code) {
              console.warn(e);
              resolve(null);
            } else {
              resolve(e);
            }
          },
          ontimeout: e => {
            console.warn(e);
            resolve(null);
          },
          onerror: e => {
            console.warn(e);
            resolve(null);
          }
        });
      });
    } else {
      return null;
    }
  }
  async function getIMDbID(timeout = TIMEOUT) {
    const $season = $('#season');
    try {
      if ($season[0] && $season.find(':selected')[0].innerText !== '1') {
        const DoubanID = $season.find('option:first-of-type').val();
        const resp = await Promise.race([
          fetch(`https://movie.douban.com/subject/${DoubanID}`),
          new Promise(resolve =>
            setTimeout(() => {
              resolve({
                ok: false,
                message: `fetch ${DoubanID} douban page time out`
              });
            }, timeout)
          )
        ]);
        if (resp.ok) {
          const htmlString = await resp.text();
          return $$(htmlString)
            .find('#info a[href^="https://www.imdb.com/title/tt"]')[0]
            .innerText.match(/tt(\d+)/)[1];
        } else {
          console.warn(resp);
          return null;
        }
      } else {
        return $(
          '#info a[href^="https://www.imdb.com/title/tt"]'
        )[0].innerText.match(/tt(\d+)/)[1];
      }
    } catch (e) {
      return null;
    }
  }
  async function getIMDbScore(ID, timeout = TIMEOUT) {
    if (ID) {
      return new Promise(resolve => {
        GM_xmlhttpRequest({
          method: 'GET',
          url: `https://p.media-imdb.com/static-content/documents/v1/title/tt${ID}/ratings%3Fjsonp=imdb.rating.run:imdb.api.title.ratings/data.json`,
          headers: {
            referrer: 'https://p.media-imdb.com/'
          },
          timout: timeout,
          onload: x => {
            try {
              const e = JSON.parse(x.responseText.slice(16, -1));
              resolve(e.resource);
            } catch (e) {
              console.warn(e);
              resolve(null);
            }
          },
          ontimeout: e => {
            console.warn(e);
            resolve(null);
          },
          onerror: e => {
            console.warn(e);
            resolve(null);
          }
        });
      });
    } else {
      return null;
    }
  }
  async function getAwards(ID, timeout = TIMEOUT) {
    if (ID) {
      const resp = await Promise.race([
        fetch(`https://movie.douban.com/subject/${ID}/awards`),
        new Promise(resolve =>
          setTimeout(() => {
            resolve({
              ok: false,
              message: `fetch ${ID} douban awards time out`
            });
          }, timeout)
        )
      ]);
      if (resp.ok) {
        const htmlString = await resp.text();
        return $$(htmlString)
          .find('div.awards')
          .toArray()
          .map(e => {
            const $title = $(e).find('.hd>h2');
            const $awards = $(e).find('.award');
            return {
              name: $title
                .find('a')
                .text()
                .trim(),
              year: parseInt(
                $title
                  .find('.year')
                  .text()
                  .match(/\d+/)[0]
              ),
              awards: $awards.toArray().map(e => ({
                name: $(e)
                  .find('li:first-of-type')
                  .text()
                  .trim(),
                people: $(e)
                  .find('li:nth-of-type(2)')
                  .text()
                  .split('/')
                  .map(e => e.trim())
              }))
            };
          });
      } else {
        return [];
      }
    } else {
      return [];
    }
  }
  async function getCelebrities(ID, timeout = TIMEOUT) {
    if (ID) {
      const fetchCeleb = await Promise.race([
        fetch(`https://movie.douban.com/subject/${ID}/celebrities`),
        new Promise(resolve =>
          setTimeout(() => {
            resolve({
              ok: false,
              message: `fetch ${ID} douban celebrities time out`
            });
          }, timeout)
        )
      ]);
      const fetchAPI = DoubanAPI(ID);
      const respCeleb = await fetchCeleb;
      let jsonCeleb, jsonAPI;
      if (respCeleb.ok) {
        const htmlString = await respCeleb.text();
        const entries = $$(htmlString)
        .find('#celebrities>div.list-wrapper')
        .toArray()
        .map(e => {
          const [positionChinese, positionForeign] = $(e)
          .find('h2')
          .text()
          .match(/([^ ]*)(?:$| )(.*)/)
          .slice(1, 3);
          const people = $(e)
          .find('li.celebrity')
          .toArray()
          .map(e => {
            let [nameChinese, nameForeign] = $(e)
            .find('.info>.name')
            .text()
            .match(/([^ ]*)(?:$| )(.*)/)
            .slice(1, 3);
            if (!nameChinese.match(/[\u4E00-\u9FCC]/)) {
              nameForeign = nameChinese + ' ' + nameForeign;
              nameChinese = null;
            }
            const [roleChinese, roleForeign, character] = $(e)
            .find('.info>.role')
            .text()
            .match(/([^ ]*)(?:$| )([^(]*)(?:$| )(.*)/)
            .slice(1, 4);
            return {
              name: {
                chs: nameChinese,
                for: nameForeign
              },
              role: {
                chs: roleChinese,
                for: roleForeign
              },
              character: character.replace(/[()]/g, '')
            };
          });
          return [
            positionForeign.toLowerCase(),
            {
              position: positionChinese,
              people: people
            }
          ];
        });
        if (entries.length) {
          jsonCeleb = Object.fromEntries(entries);
        } else {
          jsonCeleb = null;
        }
      } else {
        jsonCeleb = null;
      }
      const respAPI = await fetchAPI;
      if (respAPI) {
        const splitName = (e, chsRole, forRole) => {
          let [nameChinese, nameForeign] = e
            .match(/([^ ]*)(?:$| )(.*)/)
            .slice(1, 3);
          if (!nameChinese.match(/[\u4E00-\u9FCC]/)) {
            nameForeign = nameChinese + ' ' + nameForeign;
            nameChinese = null;
          }
          return {
            name: {
              chs: nameChinese,
              for: nameForeign
            },
            role: {
              chs: chsRole,
              for: forRole
            },
            character: ''
          };
        };
        jsonAPI = {
          director: {
            position: '导演',
            people: (respAPI.attrs.director || []).map(e =>
              splitName(e, '导演', 'Director')
            )
          },
          cast: {
            position: '演员',
            people: (respAPI.attrs.cast || []).map(e =>
              splitName(e, '演员', 'Actor/Actress')
            )
          },
          writer: {
            position: '编剧',
            people: (respAPI.attrs.writer || []).map(e =>
              splitName(e, '编剧', 'Writer')
            )
          }
        };
      } else {
        jsonAPI = null;
      }
      if (jsonCeleb === null) {
        return jsonAPI;
      } else if (jsonAPI === null) {
        return jsonCeleb;
      } else {
        ['director', 'cast', 'writer'].forEach(prop => {
          if (jsonCeleb[prop]) {
            jsonAPI[prop].people.forEach(e => {
              const flag = jsonCeleb[prop].people.filter(f => {
                return f.name.for === e.name.for;
              });
              if (flag.length === 0) {
                jsonCeleb[prop].people.push(e);
              }
            });
          }
          else {
            jsonCeleb[prop] = jsonAPI[prop];
          }
        });
        return jsonCeleb;
      }
    } else {
      return null;
    }
  }
  // Mtime is HTTP only
  async function MtimeSearch(
    chineseTitle,
    year,
    count = 10,
    timeout = TIMEOUT + 2000 //mtime search is slow, so tolerance is higher
  ) {
    return new Promise(resolve => {
      GM_xmlhttpRequest({
        method: 'POST',
        url: 'http://my.mtime.com/Service/Movie.mc',
        headers: {
          'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        data: [
          'Ajax_CallBack=true',
          'Ajax_CallBackType=Mtime.MemberCenter.Pages.MovieService',
          'Ajax_CallBackMethod=GetSearchMoviesByTitle',
          `Ajax_CallBackArgument0=${encodeURIComponent(chineseTitle)}`,
          `Ajax_CallBackArgument1=${count}`
        ].join('&'),
        responseType: 'json',
        timeout: timeout,
        onload: x => {
          const e = x.response;
          if (e.error) {
            console.warn(e);
            resolve(null);
          } else {
            resolve(
              e.value.filter(e => {
                return chineseTitle.includes(e.TitleCn) && e.Year == year;
              })[0] || null
            );
          }
        },
        ontimeout: e => {
          console.warn(e);
          resolve(null);
        },
        onerror: e => {
          console.warn(e);
          resolve(null);
        }
      });
    });
  }
  // ERROR 521 is handled. (generate cookies on the spot)
  async function getBehindTheScene(ID, cookies = GM_getValue('MtimeCookie', ''), timeout = TIMEOUT) {
    if (ID) {
      return new Promise(resolve => {
        GM_xmlhttpRequest({
          method: 'GET',
          url: `http://movie.mtime.com/${ID}/behind_the_scene.html`,
          cookie: cookies,
          timeout: timeout,
          onload: x => {
            if (x.status === 200) {
              GM_setValue('MtimeCookie', cookies);
              const e = x.responseText;
              resolve(
                Object.fromEntries(
                  $$(e)
                    .find('.revealed_modle')
                    .toArray()
                    .map((e, i) => {
                      let content, type;
                      const wrapper = $(e)
                        .children()
                        .filter('[class^="revealed_"]');
                      switch (wrapper.attr('class')) {
                        case 'revealed_list':
                          content = $(e)
                            .find('dl.revealed_list>dd')
                            .toArray()
                            .map((e, i) =>
                              e.innerText
                                .trim()
                                .replace(new RegExp(`^${i + 1}`), '')
                            );
                          type = 'list';
                          break;
                        case 'revealed_lines':
                          content = $(e)
                            .find('div.revealed_lines>dl>dd')
                            .toArray()
                            .map((e, i) => {
                              $(e)
                                .find('br')
                                .before(document.createTextNode('\n'))
                                .remove();
                              return e.innerText.trim();
                            });
                          type = 'lines';
                          if (content.length === 0) {
                            content = $(e)
                              .find(
                                'div.revealed_album>div.revealed_album_list li'
                              )
                              .toArray()
                              .map(
                                (e, i) =>
                                  `${$(e).attr('title')}：${$(e).attr(
                                    'imgabstract'
                                  )}`
                              );
                            type = 'album';
                          }
                          break;
                        case 'revealed_other':
                          content = wrapper
                            .contents()
                            .toArray()
                            .map(e =>
                              $(e)
                                .contents()
                                .toArray()
                                .map(e =>
                                  (e.nodeType === 1 && e.matches('br'))
                                    ? '\n'
                                    : e.textContent.replace(/^　+|\n/g, '')
                                )
                                .join('')
                            )
                            .join('\n\n\n')
                            .replace(/\n\n/g, '\n')
                            .replace(/\n{2,}/g, '\n\n')
                            .trim();
                          type = 'other';
                          break;
                        case 'revealed_album':
                          content = $(e)
                            .find(
                              'div.revealed_album>div.revealed_album_list li'
                            )
                            .toArray()
                            .map(
                              (e, i) =>
                                `${$(e).attr('title')}：${$(e).attr(
                                  'imgabstract'
                                )}`
                            );
                          type = 'album';
                          break;
                        case 'revealed_news':
                          content = $(e)
                            .find('h3>a')
                            .attr('href');
                          type = 'news';
                          break;
                      }
                      return [
                        $(e)
                          .find('h4')
                          .text()
                          .trim()
                          .toLowerCase() || type + i,
                        {
                          title: $(e)
                            .find('h3')
                            .text()
                            .trim(),
                          content: content,
                          type: type
                        }
                      ];
                    })
                )
              );
            } else if (x.status === 521) {
              try {
                const jsCode = $$(x.responseText)
                  .filter('script')
                  .text()
                  .trim()
                  .replace(/(\w+) s?= ?"(.+?)".+?eval\(\1\);/, '$2')
                  .replace(
                    /eval\(".+?\((.+?)\).*?"\)/,
                    `return $1.match(/document\.cookie\s?=\s?'([^;]+?); /)[1]`
                  );
                const inputArg = parseInt(jsCode.match(/\w+\((\d+)\)/)[1]);
                const inputPar = jsCode.match(/function[^(]+\((\w+)\)/)[1];
                const funBody = jsCode
                  .match(/function.+?{(.+)}/)[1]
                  .replace(inputPar, inputArg);
                const fun = new Function(funBody);
                const cookies = fun();
                resolve(getBehindTheScene(ID, cookies));
              } catch (e) {
                console.warn(e);
                resolve(null);
              }
            } else {
              console.warn(x);
              resolve(null);
            }
          },
          ontimeout: e => {
            console.warn(e);
            resolve(null);
          },
          onerror: e => {
            console.warn(e);
            resolve(null);
          }
        });
      });
    } else {
      return null;
    }
  }
  async function getInfo() {
    const [titles, isChinese] = getTitles(),
      year = getYear(),
      regions = getRegions(),
      genres = getGenres(),
      languages = getLanguages(),
      releaseDates = getReleaseDates(),
      durations = getDurations(),
      episodeDuration = getEpisodeDuration(),
      episodeCount = getEpisodeCount(),
      tags = getTags(),
      DoubanID = getDoubanID(),
      DoubanScore = getDoubanScore(),
      poster = getPoster(),
      description = getDescription();

    let IMDbID, IMDbScore, awards, celebrities, behindTheScene;

    const concurrentFetches = [];

    concurrentFetches.push(
      // IMDb Fetch
      getIMDbID()
        .then(e => {
          IMDbID = e;
          return getIMDbScore(IMDbID);
        })
        .then(e => {
          IMDbScore = e;
        }),

      // Awards Fetch
      getAwards(DoubanID).then(e => {
        awards = e;
      }),

      // Celebrities Fetch
      getCelebrities(DoubanID).then(e => {
        celebrities = e;
      }),

      // MTime
      MtimeSearch(titles.chineseTitle, year)
        .then(e => (e ? getBehindTheScene(e.MovieId) : null))
        .then(e => {
          behindTheScene = e;
        })
    );

    await Promise.all(concurrentFetches);
    // Amend Titles
    if (IMDbScore && IMDbScore.title) {
      if (isChinese) {
        if (!titles.translatedTitle.includes(IMDbScore.title)) {
          titles.alsoKnownAsTitles.push(titles.translatedTitle);
          const index = titles.alsoKnownAsTitles.indexOf(IMDbScore.title);
          if (index >= 0) {
            titles.alsoKnownAsTitles.splice(index, 1);
          }
          titles.translatedTitle = IMDbScore.title;
        }
      } else {
        if (
          !titles.originalTitle.includes(IMDbScore.title) &&
          titles.alsoKnownAsTitles.indexOf(IMDbScore.title) === -1
        ) {
          titles.alsoKnownAsTitles.push(IMDbScore.title);
        }
      }
    }
    return {
      poster: poster,
      titles: titles,
      year: year,
      regions: regions,
      genres: genres,
      languages: languages,
      releaseDates: releaseDates,
      durations: durations,
      episodeDuration: episodeDuration,
      episodeCount: episodeCount,
      tags: tags,
      DoubanID: DoubanID,
      DoubanScore: DoubanScore,
      IMDbID: IMDbID,
      IMDbScore: IMDbScore,
      awards: awards,
      celebrities: celebrities,
      description: description,
      behindTheScene: behindTheScene
    };
  }

  function formatInfo(info) {
    let temp;
    const infoText = (
      (info.poster ? `[img]${info.poster}[/img]\n\n` : '') +
      '◎译　　名　' + [info.titles.translatedTitle].concat(info.titles.alsoKnownAsTitles).join(' / ') + '\n' +
      '◎片　　名　' + info.titles.originalTitle + '\n' +
      '◎年　　代　' + info.year + '\n' +
      (info.regions.length ? '◎产　　地　' + info.regions.join(' / ') + '\n' : '') +
      (info.genres.length ? '◎类　　别　' + info.genres.join(' / ') + '\n' : '') +
      (info.languages.length ? '◎语　　言　' + info.languages.join(' / ') + '\n' : '') +
      (info.releaseDates.length ? '◎上映日期　' + info.releaseDates.join(' / ') + '\n' : '') +
      ((info.IMDbScore &&
        info.IMDbScore.rating) ? `◎IMDb评星  ${
       temp = Math.round(info.IMDbScore.rating),
       '★'.repeat(temp) + '␣'.repeat(10 - temp)
       }\n◎IMDb评分  ${Number(info.IMDbScore.rating).toFixed(1)}/10 from ${addComma(info.IMDbScore.ratingCount)} users\n` : '') +
      (info.IMDbID ? `◎IMDb链接  https://www.imdb.com/title/tt${info.IMDbID}/\n` : '') +
      ((info.DoubanScore &&
       info.DoubanScore.rating) ? `◎豆瓣评星　${
       temp = Math.round(info.DoubanScore.rating),
       '★'.repeat(Math.floor(temp / 2)) + (temp % 2 ? '☆' : '') + '␣'.repeat(5 - Math.ceil(temp / 2))
       }\n◎豆瓣评分　${info.DoubanScore.rating}/10 from ${addComma(info.DoubanScore.ratingCount)} users\n` : '') +
      (info.DoubanID ? `◎豆瓣链接　https://movie.douban.com/subject/${info.DoubanID}/\n` : '') +
      ((info.durations &&
        info.durations.length) ? '◎片　　长　' + info.durations.join(' / ') + '\n' : '') +
      (info.episodeDuration ? '◎单集片长　' + info.episodeDuration + '\n' : '') +
      (info.episodeCount ? '◎集　　数　' + info.episodeCount + '\n' : '') +
      (info.celebrities ? Object.entries(info.celebrities).map(e => {
        const position = e[1].position;
        let title = '◎';
        switch (position.length) {
          case 1:
            title += '　  ' + position + '　  　';
            break;
          case 2:
            title += position.split('').join('　　') + '　';
            break;
          case 3:
            title += position.split('').join('  ') + '　';
            break;
          case 4:
            title += position + '　';
            break;
          default:
            title += position + '\n　　　　　　';
        }
        const people = e[1].people.map((f, i) => {
          const name = f.name.chs ? (f.name.for ? f.name.chs + ' / ' + f.name.for : f.name.chs) : f.name.for;
          return (i > 0 ? '　　　　　　' : '') + name + (f.character ? ` | ${f.character}` : '');
        }).join('\n');
        return title + people;
      }).join('\n') + '\n\n' : '') +
      (info.tags.length ? '◎标　　签　' + info.tags.join(' | ') + '\n\n' : '') +
      (info.description ? '◎简　　介　\n' + info.description.replace(/^|\n/g, '\n　　') + '\n\n' : '') +
      (info.awards.length ? '◎获奖情况　\n\n' + info.awards.map(e => {
        const awardName = '　　' + e.name + ' (' + e.year + ')\n';
        const awardItems = e.awards.map(e => '　　' + e.name + (e.people ? ' ' + e.people : '')).join('\n');
        return awardName + awardItems;
      }).join('\n\n') + '\n\n' : '') +
      (info.behindTheScene ? Object.entries(info.behindTheScene).map(e => {
        const title = '◎' + e[1].title + '\n\n';
        let content;
        switch (e[1].type) {
          case 'list':
          case 'lines':
            content = '　　✰' + e[1].content.join('\n　　✰');
            break;
          default:
            content = '　　' + e[1].content.replace(/\n/g, '\n　　');
        }
        return title + content;
      }).join('\n\n') + '\n\n' : '')
    ).trim();
    return infoText;
  }

  $('body').append($copyPaste);
  $('#info')
    .append($toggle)
    .append(' ')
    .append($infoGen)
    .append($message);
  $infoGen.state = 0;
  const infoGenClickEvent = async e => {
    switch ($infoGen.state) {
      case 0: //获取
        $infoGen.off('click');
        $infoGen.text('获取中...');
        $copyPaste.val(formatInfo(await getInfo()));
        $infoGen.state = 1;
        $infoGen.text('复制');
        $infoGen.on('click', infoGenClickEvent);
        break;
      case 1: //复制
        {
          const copyResult = jsCopy($copyPaste[0]);
          if (copyResult) {
            $message
              .css({ color: 'green' })
              .text('复制成功')
              .fadeIn(200, () => $message.fadeOut(200));
          }
          else {
            $message
              .css({ color: 'red' })
              .text('复制失败')
              .fadeIn(200, () => $message.fadeOut(200));
          }
        }
        break;
    }
  };
  $infoGen.on('click', infoGenClickEvent);
})(window.$.noConflict(true));
