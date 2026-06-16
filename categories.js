export const categories = [
  { value: '...', label: 'Other' },
  { value: 'edu', label: 'Educational & Tutorials' },
  { value: 'ent', label: 'Entertainment & Comedy' },
  { value: 'car', label: 'Cars & Vehicles' },
  { value: 'art', label: 'Art & Design' },
  { value: 'fil', label: 'Film & Animation' },
  { value: 'mus', label: 'Music' },
  { value: 'gam', label: 'Gaming' },
  { value: 'bus', label: 'Career & Business' },
  { value: 'lif', label: 'Life Stories' },
  { value: 'new', label: 'News & Politics' },
  { value: 'act', label: 'Activism & Nonprofits' },
  { value: 'pet', label: 'Pets & Animals' },
  { value: 'spo', label: 'Sports & Fitness' },
  { value: 'tec', label: 'Technology & Science' },
  { value: 'tra', label: 'Travel & Events' },
  { value: 'foo', label: 'Food & Cooking' },
  { value: 'shi', label: 'Sh*tposting & Memes' }
]

export function renderCategoryOptions(selectElement, includeAll = false) {
  selectElement.innerHTML = ''

  if (includeAll) {
    const allOption = document.createElement('option')
    allOption.value = ''
    allOption.textContent = 'All Categories'
    selectElement.appendChild(allOption)
  }

  categories.forEach(({ value, label }) => {
    const option = document.createElement('option')
    option.value = value
    option.textContent = label
    selectElement.appendChild(option)
  })
}
