/** @jsx h */

function NavPreview({ entry: immutableEntry }) {
  // I want to work with a plain JS object, not the immutable object it gives me.
  const entry = JSON.parse(JSON.stringify(immutableEntry));

  return (
    <section>
      <h1>{entry.data.title}</h1>

      <ul>
        {entry.data.groups.map(group => (
          <li>
            {group.label}
            {renderGroupLinks(group)}
          </li>
        ))}
      </ul>
    </section>
  );

  function renderGroupLinks(group) {
    if (group.label === 'Components') {
      return (
        <ul>
          <li>
            <em>[The component pages will be automatically inserted here.]</em>
          </li>
        </ul>
      );
    } else if (group.links) {
      return (
        <ul>
          {group.links.map(link => (
            <li>
              <a href={link.url}>{link.label}</a>
            </li>
          ))}
        </ul>
      );
    }
  }
}

CMS.registerPreviewTemplate('nav', NavPreview);
