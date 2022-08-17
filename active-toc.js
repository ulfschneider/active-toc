/**
 * ActiveToc
 *
 * Make your table of contents active.
 * 
 * Please visit <a href="https://ulf.codes/active-toc">ulf.codes/active-toc</a> or 
 * download the repo and open the file <code>index.html</code> to see the usage.
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
 * 
 * ActiveToc is using the <a href="https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API">IntersectionObserver API</a>.
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
        let containerSelector;
        config = transferConfig(settings);

        if (!config.tocContainer) {
            containerSelector = '#header';
        } else if (typeof config.tocContainer == 'string') {
            containerSelector = config.tocContainer;
        } else {
            tocContainer = config.tocContainer;
        }

        if (document.querySelector && window.IntersectionObserver) {
            if (containerSelector) {
                tocContainer = document.querySelector(containerSelector);
                if (!tocContainer) {
                    tocContainer = document.getElementsByTagName('header')[0];
                }

                if (!tocContainer) {
                    console.error('A toc container with id=[' + containerSelector + '] or the tag=<header> could not be found in DOM');
                    return;
                }
            }

            links = [...tocContainer.querySelectorAll('a')];
            headings = [];
            links.forEach(link => {
                let id = link.getAttribute('href');
                if (id && id.startsWith('#')) {
                    try {
                        headings.push(document.querySelector(id));
                    } catch (e) {
                        console.warn('Heading with id=[' + id + '] not found in document');
                    }
                }
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
        } else {
            console.error('ActiveToc cannot run on this device because the Intersection Observer API is not supported.');
        }
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

        if (links) {
            links.forEach(link => {
                link.classList.remove('is-visible');
                link.classList.remove('is-active');
            });
        }
    }

    function handleObserver(entries, observer) {
        entries.forEach(entry => {
            let href = `#${entry.target.getAttribute('id')}`;

            links.forEach(link => {
                link.classList.remove('is-highlight');
                link.classList.remove('is-active');

                if (link.getAttribute('href') === href) {
                    if (entry.isIntersecting) {
                        link.classList.add('is-visible')
                    } else {
                        link.classList.remove('is-visible');
                    }
                }
            });

            indicateActive();
            indicateHighlight();
        });
    }

    function indicateActive() {
        for (let i = headings.length - 1; i >= 0; i--) {
            if (headings[i] && headings[i].offsetTop <= window.pageYOffset) {
                let actives = tocContainer.querySelectorAll(
                    `a[href="#${headings[i].id}"]`
                );
                actives.forEach(active => {
                    active.classList.add('is-active');
                })
                break;
            }
        }
    }

    function indicateHighlight() {
        let firstMatch;
        for (let link of links) {
            //check if a visible link exists 
            //and highlight the first one 
            if (link.classList.contains('is-visible')) {

                if (!firstMatch) {
                    firstMatch = link.href;
                }

                if (firstMatch === link.href) {
                    link.classList.add('is-highlight');
                }
            }
        }

        if (!firstMatch) {
            //no visible link exists 
            //mark all actives to be visible
            let actives = tocContainer.querySelectorAll('a.is-active');
            actives.forEach(active => {
                active.classList.add('is-highlight');
            });
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
            * Without defining the tocContainer a call like <code>ActiveToc.init()</code> will search for a container
            * with <code>id="header"</code> or a tag <code>header</code> and will make that container the active toc.
            * That container has to hold a set of links to headings inside of the document. Each heading needs to be identified with the id attribute.
            * When scrolling contents or resizing the window, the links in the tocContainer will be assigned the CSS class named <code>is-visible</code> if the associated heading of the link is visible.
            * The link will be assigned the CSS class name <code>is-active</code> if the heading is not visible, but still can be considered active.
            * The link will be assigned the CSS class name <code>is-highlight</code> as the single one that´s suggested to be highlighted (to avoid highlighting multiple entries).
            * @param {*} [settings]
            * @param {String} [settings.tocContainer] - Specify the selector of the container that contains links to the headings inside of your document. Default is 'header'. If not specified the first html <code>header</code> tag will be used.
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