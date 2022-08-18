<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

### Table of Contents

-   [ActiveToc][1]
-   [init][2]
    -   [Parameters][3]
-   [destroy][4]
-   [unobserve][5]

## ActiveToc

Make your table of contents (toc) active.

Please visit <a href="https://ulf.codes/tools/active-toc/">ulf.codes/tools/active-toc</a> or 
download the repo and open the file <code>index.html</code> to see the usage.

Install ActiveToc in your Node project with 

<pre><code>
npm i active-toc
</code></pre>

and use it inside your code via 

<pre><code>
const ActiveToc = require('active-toc');
</code></pre>

or, alternatively 

<pre><code>
import ActiveToc from 'active-toc';
</code></pre>

You can also use it by embedding the script <code>active-toc.min.js</code> in your web page.

<pre><code>
&lt;script src="active-toc.min.js">&lt;/script>
</code></pre> 

ActiveToc is using the <a href="https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API">IntersectionObserver API</a>.

## init

Without defining the toc container a call like <code>ActiveToc.init()</code> will search for an element
with <code>id="header"</code> or a <code>header</code> tag and will make that element the container for the active toc.
The container has to hold a set of links to headings (h2, h3, h4, ...) inside of the document. Each heading needs to be identified with the id attribute.
When scrolling contents or resizing the window, the links in the tocContainer will be assigned a combination of the CSS classes  

<ul>
<li><code>is-visible</code> if the associated heading of the link is visible,</li>
<li>><code>is-active</code> if the heading is not visible, but still can be considered active,</li>
<li>><code>is-highlight</code> as the single one that´s suggested to be highlighted (to avoid highlighting multiple entries),</li>
</ul>

### Parameters

-   `settings` **any?** – Can be empty, a String, or a settings object. A String will be interpreted as a <a href="https://developer.mozilla.org/en-US/docs/Web/API/Document_object_model/Locating_DOM_elements_using_selectors">selector</a> for the toc container. A settings object must contain a tocContainer property that will store the selector for the toc container.
    -   `settings.tocContainer` **[String][6]?** Specify the selector of the container that holds the links to the headings inside of your document. Default id is <code>#header</code>. If not specified the first html <code>header</code> tag will be used.

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
