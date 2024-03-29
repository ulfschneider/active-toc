<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

### Table of Contents

-   [ActiveToc][1]
-   [init][2]
    -   [Parameters][3]
-   [destroy][4]
-   [unobserve][5]

## ActiveToc

Make your table of contents (toc) active.

Please visit <a href="https://ulf.codes/tools/active-toc/">ulf.codes/tools/active-toc</a> to see ActiveToc in action or 
download the <a href="https://github.com/ulfschneider/active-toc">GitHub repo</a> and open the file <code>index.html</code> to see the usage.

Embed the script <code>active-toc.min.js</code> in your web page.

<pre><code>
&lt;script src="active-toc.min.js">&lt;/script>
</code></pre> 

ActiveToc is using the <a href="https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API">IntersectionObserver API</a>.

## init

Without defining the toc container a call like <code>ActiveToc.init()</code> will search for an element
with <code>id="header"</code> or a <code>header</code> tag and will make that element the container for the active toc.
The container has to hold a set of links to headings (h2, h3, h4, h5, h6) inside of the document. Each heading needs to be identified with the id attribute.
When scrolling contents or resizing the window, the links in the tocContainer will be assigned a combination of the CSS classes  

<ul>
<li><code>is-visible</code> if the associated heading of the link is visible</li>
<li><code>is-active</code> if the heading is not visible, but still can be considered active</li>
<li><code>is-highlight</code> as the single one that´s suggested to be highlighted (to avoid highlighting multiple entries)</li>
</ul>
In addition, the headings themself also get CSS classes assigned:
<ul>
<li><code>h-is-visible</code> if the heading visible</li>
<li><code>h-is-active</code> if the heading is not visible, but still can be considered active</li>
<li><code>h-is-highlight</code> as the single heading that´s suggested to be highlighted (to avoid highlighting multiple entries)</li>
</ul>
If no tocContainer can be found, the headings of the document will only be processed if <code>settings.headless</code> is <code>true</code>, otherwise the headings will be ignored.
If <code>settings.headless</code> is true, the headings alone will be analyzed and the <code>h-is-visible</code>, <code>h-is-active</code>, <code>h-is-highlight</code> classes will be assigned as appropriate to the headings.

### Parameters

-   `settings` **([string][6] \| [Object][7])?** – Optional: Can be empty, a String, or a settings object. A String will be interpreted as a <a href="https://developer.mozilla.org/en-US/docs/Web/API/Document_object_model/Locating_DOM_elements_using_selectors">selector</a> for the toc container. A settings object must contain a tocContainer property that will store the selector for the toc container.
    -   `settings.tocContainer` **[string][6]?** Optional: Specify the selector of the container that holds the links to the headings inside of your document. Default id is <code>#header</code>. If not specified the first html <code>header</code> tag will be used.
    -   `settings.headless` **[boolean][8]** Optional: If true, headings are processed without an associated tocContainer (optional, default `false`)
    -   `settings.intersectionOptions` **IntersectionOptions?** Optional: The Intersection observer options as defined by the intersection observer API
    -   `settings.onVisible` **function ([Object][7], [Object][7])?** Optional: A function that will be called when an element receives visible status. The toc entry that received visible status (null if the entry doesn´t exist) and the associated heading will be passed as arguments into the function.
    -   `settings.onActive` **function ([Object][7], [Object][7])?** Optional: A function that will be called when an element receives active status. The toc entry that received active status (null if the entry doesn´t exist) and the associated heading will be passed as arguments into the function.
    -   `settings.onHighlight` **function ([Object][7], [Object][7])?** Optional: A function that will be called when an element receives highlight status. The toc entry that received visible status (null if the entry doesn´t exit) and the associated heading will be passed as arguments into the function.
    -   `settings.offHighlight` **function ()?** Optional: A function that will be called when a highlighted element looses the highlight status and no new highlighted element is available.

## destroy

Revert all changes that have been made by ActiveToc

## unobserve

Do no longer observe the headings of the document

[1]: #activetoc

[2]: #init

[3]: #parameters

[4]: #destroy

[5]: #unobserve

[6]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String

[7]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object

[8]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean
