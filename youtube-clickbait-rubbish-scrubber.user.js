// ==UserScript==
// @name         YouTube Clickbait Rubbish Scrubber
// @namespace    http://dbiru.com/
// @version      0.1
// @description  I'm just so tired of this Rubbish. For now, this script simply marks offending, clickbaity videos with an identifier so you can be on your way.
// @author       dbiru
// @match        https://www.youtube.com/*
// @grant        none
// ==/UserScript==
(function() {
    'use strict';

    var settings = {
        markVideos: true,
        hideVideos: false,
        markingTag: '[Rubbish]',
        annoyancesBlocked: [
            'vlogs',
            'compilations',
            'reactions',
            'generalRubbish',
            'clickbaits'
        ],

        generalRubbish: {
            tag: '[Just Rubbish]',
            patterns: [
                /^[\W]+$/g,
                /^[A-Z\s0-9\(\)\!-_]+$/
            ]
        },

        reactions: {
            tag: '[Reaction Rubbish]',
            patterns: [
                /(live|best) reaction/i,
                /try not to \w*/i,
                /react to/i,
                /REACTION[!]*$/i
            ]
        },

        clickbaits: {
            tag: '[Clickbait]',
            patterns: [
                /top \d+/i,
                /ultimate .+/i,
                /\d+.*gone.*/i,
                /the most/i,
                /fail wins/i
            ]
        },

        compilations: {
            tag: '[Compilation Rubbish]',
            patterns: [
                /compilation/i,
                /best of/i,
                /videos[\s!#]*$/i,
                /\d+\s*(best|worst|winning|losing|successfully|win)/i,
                /^.*#\d+$/i
            ]
        },

        vlogs: {
            tag: '[Vlog Rubbish]',
            patterns: [
                /vlog/i
            ]
        }
    };


    var isAnnoyance = function(video) {
        var title = video.getAttribute('title');
        settings.annoyancesBlocked.forEach(function(annoyance) {
            //console.info('Checking', title,'annoyance type: ' + annoyance);
            settings[annoyance].patterns.forEach(function(clickbait) {
                if (title.search(clickbait) !== -1) {
                    //console.info('Matched', title, 'on ', settings[annoyance].patterns);
                    throw new Error(settings[annoyance].tag);
                }
            });
        });
    };

    var checkVideoForAnnoyance = function(video_title) {
        var video_parent;
        try {
            if (video_title.getAttribute('data-marked') === null)
                video_title.setAttribute('data-marked', 'true'); 
                isAnnoyance(video_title);
        } catch (e) {
            video_parent = video_title.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
            video_title.setAttribute('style', 'background: red; padding: 3px; border-radius: 2.5px; color: white;');
            video_title.innerText = e.message + ' ' + video_title.innerText;
            //video_parent.remove(); // soon...
        }
    };

    var init = function() {
        var video_titles = document.querySelectorAll('#video-title:not([data-marked="true"]');
        var i;
        for (i = 0; i < video_titles.length; i++) {
            checkVideoForAnnoyance(video_titles[i]);
        }
    };

    window.onload = function() {
        init();
        setInterval(init, 1200);
    };
})();
