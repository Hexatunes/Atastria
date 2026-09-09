fetch(`${SERVER_URL}/requestUpdate/____`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ value })
  })
    .then(res => res.json())
    .then(data => {
      if (data.status === 'success') {
        save = data.save;
        // stuff
      } else {
        console.warn('Update rejected:', data.error);
      }
      return data;
    });