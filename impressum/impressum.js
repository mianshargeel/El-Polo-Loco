document.addEventListener('DOMContentLoaded', function() {
  const showImpressum = document.getElementById('showImpressum');
  const closeImpressum = document.getElementById('closeImpressum');
  const impressumDialog = document.getElementById('impressumDialog');
  const impressumContent = document.getElementById('impressumContent');
  
  // Show dialog when Impressum link is clicked
  showImpressum.addEventListener('click', async function(e) {
    e.preventDefault();
    
    // Show loading state
    impressumContent.innerHTML = '<div class="loading">Loading Impressum...</div>';
    impressumDialog.style.display = 'flex';
    
    try {
      // Fetch the impressum content
      const response = await fetch(showImpressum.getAttribute('href'));
      const html = await response.text();
      
      // Extract the content from the impressum.html
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const content = doc.querySelector('body') || doc.documentElement;
      
      // Insert the content into our dialog
      impressumContent.innerHTML = content.innerHTML;
    } catch (error) {
      impressumContent.innerHTML = '<div class="error">Failed to load Impressum content.</div>';
      console.error('Error loading impressum:', error);
    }
  });
  
  // Close dialog when close button is clicked
  closeImpressum.addEventListener('click', function() {
    impressumDialog.style.display = 'none';
  });
  
  // Close dialog when clicking outside the content
  impressumDialog.addEventListener('click', function(e) {
    if (e.target === impressumDialog) {
      impressumDialog.style.display = 'none';
    }
  });
  
  // Close dialog with Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && impressumDialog.style.display === 'flex') {
      impressumDialog.style.display = 'none';
    }
  });
});