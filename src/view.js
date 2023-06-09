const setAttributes = (element, attributes) => {
  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
};

const handleForm = (elements, i18nInstance, value) => {
  switch (value) {
    case 'success':
      elements.inputEl.classList.remove('is-invalid');
      elements.feedbackEl.classList.remove('text-danger');
      elements.feedbackEl.classList.add('text-success');
      elements.feedbackEl.textContent = i18nInstance.t('successValidation');
      elements.button.disabled = false;
      elements.inputEl.removeAttribute('readonly', 'readonly');
      elements.formEl.reset();
      elements.inputEl.focus();
      break;
    case 'failed':
      elements.inputEl.classList.add('is-invalid');
      elements.feedbackEl.classList.add('text-danger');
      elements.button.disabled = false;
      elements.inputEl.removeAttribute('readonly', 'readonly');
      break;
    default:
      throw new Error(`Unknown status: ${value}`);
  }
};

const handleLoadingProcessStatus = (elements, value) => {
  switch (value) {
    case 'idle':
      elements.button.disabled = false;
      elements.inputEl.removeAttribute('readonly', 'readonly');
      break;
    case 'loading':
      elements.button.disabled = true;
      elements.inputEl.setAttribute('readonly', 'readonly');
      elements.inputEl.classList.remove('is-invalid');
      elements.feedbackEl.textContent = '';
      break;
    default:
      throw new Error(`Unknown status: ${value}`);
  }
};

const renderFeeds = (elements, i18nInstance, feeds) => {
  const container = document.createElement('div');
  container.classList.add('card', 'border-0');
  const divTitle = document.createElement('div');
  divTitle.classList.add('card-body');
  const title = document.createElement('h2');
  title.classList.add('card-title', 'h4');
  title.textContent = i18nInstance.t('feeds');

  const listContainer = document.createElement('ul');
  listContainer.classList.add('list-group', 'border-0', 'rounded-0');

  elements.feedsContainer.innerHTML = '';

  divTitle.appendChild(title, divTitle);

  feeds.forEach((feed) => {
    const cardFeed = document.createElement('li');
    cardFeed.classList.add('list-group-item', 'border-0', 'border-end-0');

    const titleFeed = document.createElement('h3');
    titleFeed.classList.add('h6', 'm-0');
    titleFeed.textContent = feed.title;

    const descriptionFeed = document.createElement('p');
    descriptionFeed.classList.add('m-0', 'small', 'text-black-50');
    descriptionFeed.textContent = feed.description;

    cardFeed.append(titleFeed, descriptionFeed);
    listContainer.appendChild(cardFeed);
  });

  elements.feedsContainer.append(container, listContainer);
};

const renderPosts = (elements, i18nInstance, posts, watchedState) => {
  const container = document.createElement('div');
  container.classList.add('card', 'border-0');
  const divTitle = document.createElement('div');
  divTitle.classList.add('card-body');
  const title = document.createElement('h2');
  title.classList.add('card-title', 'h4');
  title.textContent = i18nInstance.t('posts');

  const postContainer = document.createElement('ul');
  postContainer.classList.add('list-group', 'border-0', 'rounded-0');

  elements.postsContainer.innerHTML = '';

  divTitle.appendChild(title);
  container.appendChild(divTitle);

  posts.forEach((post) => {
    const cardPost = document.createElement('li');
    cardPost.classList.add('list-group-item', 'border-0', 'border-end-0', 'd-flex', 'justify-content-between', 'align-items-start');
    const link = document.createElement('a');
    const button = document.createElement('button');

    cardPost.append(link, button);

    if (watchedState.uiState.posts.includes(post.id)) {
      link.classList.add('fw-normal', 'link-secondary');
    } else {
      link.classList.add('fw-bold');
    }

    setAttributes(link, {
      href: post.link,
      'data-id': post.id,
      target: '_blank',
      rel: 'noopener noreferrer',
    });

    link.textContent = post.title;

    button.classList.add('btn', 'btn-outline-primary', 'btn-sm');

    setAttributes(button, {
      type: 'button',
      'data-id': post.id,
      'data-bs-toggle': 'modal',
      'data-bs-target': '#modal',
    });

    button.textContent = (i18nInstance.t('button'));

    postContainer.appendChild(cardPost);
  });

  elements.postsContainer.appendChild(container);
  elements.postsContainer.appendChild(postContainer);
};

const renderError = (elements, i18nInstance, error) => {
  switch (error) {
    case 'url': {
      elements.feedbackEl.textContent = i18nInstance.t('errors.url');
      break;
    }
    case 'notOneOf': {
      elements.feedbackEl.textContent = i18nInstance.t('errors.notOneOf');
      break;
    }
    case 'parseError': {
      elements.feedbackEl.textContent = i18nInstance.t('errors.parseError');
      break;
    }
    case 'network': {
      elements.feedbackEl.textContent = i18nInstance.t('errors.network');
      break;
    }
    case null: {
      break;
    }

    default:
      throw new Error(`Unknown error ${error}`);
  }
};

const renderViewedPosts = (viewedPostsId) => {
  viewedPostsId.forEach((postId) => {
    const viewedPost = document.querySelector(`[data-id="${postId}"]`);
    viewedPost.classList.remove('fw-bold');
    viewedPost.classList.add('fw-normal', 'link-secondary');
  });
};

const renderModalWindow = (elements, postID, watchedState) => {
  const [currentPost] = watchedState.posts.filter((post) => post.id === postID);
  elements.modalTitle.textContent = currentPost.title;
  elements.modalBody.textContent = currentPost.description;
  elements.modalLink.setAttribute('href', currentPost.link);
};

const render = (elements, i18nInstance, watchedState) => (path, value) => {
  switch (path) {
    case 'form.status': {
      handleForm(elements, i18nInstance, value);
      break;
    }
    case 'loadingProcess.status': {
      handleLoadingProcessStatus(elements, value);
      break;
    }
    case 'form.error':
    case 'loadingProcess.error': {
      renderError(elements, i18nInstance, value);
      break;
    }
    case 'feeds': {
      renderFeeds(elements, i18nInstance, value);
      break;
    }
    case 'posts': {
      renderPosts(elements, i18nInstance, value, watchedState);
      break;
    }
    case 'uiState.posts': {
      renderViewedPosts(value);
      break;
    }
    case 'uiState.modal': {
      renderModalWindow(elements, value, watchedState);
      break;
    }
    default:
      throw new Error(`Unknown path: ${path}`);
  }
};

export default render;
