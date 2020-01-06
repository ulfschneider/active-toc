/**
 * ActiveToc
 *
 * Make your table of contents active.
 * 
 * Please review the [Active TOC Playground](https://htmlpreview.github.io/?https://github.com/ulfschneider/active-toc/blob/master/active-toc.html) to see the usage.
 * 
 * Install ActiveToc in your Node project with 
 * <pre>
 * npm i active-toc
 * </pre>
 * 
 * and use it inside your code via 
 * 
 * <pre>
 * const ActiveToc = require('active-toc');
 * </pre>
 * 
 * or, alternatively 
 * 
 * <pre>
 * import ActiveToc from 'active-toc';
 * </pre>
 * 
 * You can also use it without node, by embedding the script <code>active-toc.min.js</code> in your web page.
 * 
 * <pre>
 * &lt;script src="active-toc.min.js">&lt;/script>
 * </pre> 
 *  Without any arguments, <code>ActiveToc.init()</code> will search for a container
 *  with <code>id="header"</code> or a tag <code>header</code> and will make that container the active toc.
 */
ActiveToc = (function () {

    let config, links, headings, observer, tocContainer;

    function transferConfig(settings) {
        if (!settings) {
            config = {};
        } else {
            config = settings;
        }
        return config;
    }

    function init(settings) {
        let containerId;
        config = transferConfig(settings);

        if (!config.tocContainer) {
            containerId = '#header';
        } else if (typeof config.tocContainer == 'string') {
            containerId = config.tocContainer.charAt(0) == '#' ? config.tocContainer : '#' + config.tocContainer;
        } else {
            tocContainer = config.tocContainer;
        }

        if (document.querySelector && window.IntersectionObserver) {
            if (containerId) {
                console.log(containerId);
                tocContainer = document.querySelector(containerId);
                if (!tocContainer) {
                    tocContainer = document.getElementsByTagName('header')[0];
                }

                if (!tocContainer) {
                    console.error('TocContainer with either id=[' + containerId + '] or tag=<header> could not be found in DOM');
                    return;
                }
            }
        }

        links = [...tocContainer.querySelectorAll('a')];
        headings = links.map(link => {
            let id = link.getAttribute('href');
            return document.querySelector(id);
        });

        let intersectionOptions = {
            rootMargin: '0px'
        }
        observer = new IntersectionObserver(handleObserver, intersectionOptions);
        headings.forEach(heading => {
            if (heading) {
                observer.observe(heading);
            }
        });
    }

    function unobserve() {
        if (headings) {
            headings.forEach(heading => {
                if (heading) {
                    observer.unobserve(heading);
                }
            });
        }
    }

    function destroy() {
        unobserve();

        links.forEach(link => {
            link.classList.remove('is-visible');
            link.classList.remove('is-active');
        });
    }

    function handleObserver(entries, observer) {
        entries.forEach(entry => {
            let href = `#${entry.target.getAttribute('id')}`;
            let link = links.find(l => l.getAttribute('href') === href);

            if (entry.isIntersecting) {
                link.classList.add('is-visible')
                previousSection = entry.target.getAttribute('id');
            } else {
                link.classList.remove('is-visible');
            }

            highlightActive();
        });
    }

    function highlightActive() {
        let hasVisible = false;
        links.forEach(link => {
            link.classList.remove('is-active');
            if (link.classList.contains('is-visible')) {
                hasVisible = true;
            }
        });

        if (!hasVisible) {
            for (let i = headings.length - 1; i > 0; i--) {
                if (headings[i] && headings[i].offsetTop <= window.pageYOffset) {
                    tocContainer.querySelector(
                        `a[href="#${headings[i].id}"]`
                    ).classList.add('is-active');
                    break;
                }
            }
        }
    }

    //public API
    return {
        init: function (settings) {
            init(settings);
        },
        unobserve: function () {
            unobserve();
        },
        destroy: function () {
            destroy();
        }
    }
})();

//////// Node Module Interface

try {
    if (module) {
        module.exports = {
            /**
            * @param {*} [settings]
            * @param {String} [settings.tocContainer] - Specify the id of the container that contains links to the headings inside of your document. Default is 'header'. If not specified will search for the html <code>header</code> tag.
            */
            init: function (settings) {
                if (!this.activeToc) {
                    this.activeToc = ActiveToc;
                }
                this.activeToc.init(settings);
            },
            /**
             * Revert all changes that have been made by ActiveToc
             */
            destroy: function () {
                if (this.activeToc) {
                    this.activeToc.destroy();
                }
            },
            /**
             * Do no longer observe the headings of the document
             */
            unobserve: function () {
                if (this.activeToc) {
                    this.activeToc.unobserve();
                }
            }
        }
    }
} catch (e) {
    console.log('Using ActiveToc in non-node environment');
    //in non-node environment module is not defined and therefore
    //we will not export anything
}