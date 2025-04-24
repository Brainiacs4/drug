document.addEventListener('DOMContentLoaded', function() {
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    const medicineInfo = document.getElementById('medicine-info');
    
    const medicines = {
        'paracetamol': {
          name: 'Paracetamol',
          dosage: '500mg',
          frequency: 'Every 4-6 hours as needed',
          notes: 'Pain reliever and fever reducer.'
        },
        'dolo650': {
          name: 'Dolo650',
          dosage: '650mg per tablet',
          frequency: 'Every 4-6 hours as needed',
          notes: 'Pain reliever and fever reducer; treats headaches, muscle aches, arthritis, backaches, toothaches, colds, and fever.'
        },
        'roxid': {
          name: 'Roxid',
          dosage: '150mg',
          frequency: 'Twice daily',
          notes: 'Brand name for roxithromycin, a macrolide antibiotic used to treat respiratory tract infections.'
        },
        'coldact': {
          name: 'Coldact',
          dosage: '1 capsule',
          frequency: 'Every 6 hours',
          notes: 'Cold medication containing multiple ingredients for symptom relief.'
        },
        'aspirin': {
          name: 'Aspirin',
          dosage: '75-325mg',
          frequency: 'Once daily or as directed',
          notes: 'Blood thinner, pain reliever and anti-inflammatory.'
        },
        'azithromycin': {
          name: 'Azithromycin',
          dosage: '500mg',
          frequency: 'Once daily for 3-5 days',
          notes: 'Antibiotic used for respiratory, skin and other infections.'
        },
        'pantoprazole': {
          name: 'Pantoprazole',
          dosage: '40mg',
          frequency: 'Once daily',
          notes: 'Proton pump inhibitor used for acid reflux and ulcers.'
        },
        'cetirizine': {
          name: 'Cetirizine',
          dosage: '10mg',
          frequency: 'Once daily',
          notes: 'Antihistamine used for allergies.'
        },
        'montelukast': {
          name: 'Montelukast',
          dosage: '10mg',
          frequency: 'Once daily',
          notes: 'Used for asthma and allergy symptoms.'
        },
        'crocin': {
          name: 'Crocin',
          dosage: '500mg',
          frequency: 'Every 4-6 hours',
          notes: 'Brand name for paracetamol used for fever and pain.'
        },
        'metoprolol': {
          name: 'Metoprolol',
          dosage: '25-100mg',
          frequency: 'Once or twice daily',
          notes: 'Beta-blocker used for high blood pressure and heart conditions.'
        },
        'ciprofloxacin': {
          name: 'Ciprofloxacin',
          dosage: '500mg',
          frequency: 'Twice daily',
          notes: 'Antibiotic used for urinary and respiratory infections.'
        },
        'alprazolam': {
          name: 'Alprazolam',
          dosage: '0.25-0.5mg',
          frequency: 'Three times daily as needed',
          notes: 'Anti-anxiety medication.'
        },
        'metronidazole': {
          name: 'Metronidazole',
          dosage: '400mg',
          frequency: 'Three times daily',
          notes: 'Antibiotic used for anaerobic bacterial and protozoal infections.'
        },
        'diclofenac': {
          name: 'Diclofenac',
          dosage: '50mg',
          frequency: 'Three times daily',
          notes: 'NSAID used for pain and inflammation.'
        },
        'losartan': {
          name: 'Losartan',
          dosage: '50mg',
          frequency: 'Once daily',
          notes: 'ARB used for high blood pressure and heart failure.'
        },
        'fexofenadine': {
          name: 'Fexofenadine',
          dosage: '120mg',
          frequency: 'Once daily',
          notes: 'Non-drowsy antihistamine for allergies.'
        },
        'ambroxol': {
          name: 'Ambroxol',
          dosage: '30mg',
          frequency: 'Three times daily',
          notes: 'Mucolytic used for respiratory conditions.'
        },
        'prednisone': {
          name: 'Prednisone',
          dosage: '5-60mg',
          frequency: 'Once daily',
          notes: 'Corticosteroid used for inflammation and autoimmune conditions.'
        },
        'cefixime': {
          name: 'Cefixime',
          dosage: '200mg',
          frequency: 'Twice daily',
          notes: 'Cephalosporin antibiotic for bacterial infections.'
        },
        'ranitidine': {
          name: 'Ranitidine',
          dosage: '150mg',
          frequency: 'Twice daily',
          notes: 'H2 blocker used for acid reflux and ulcers.'
        },
        'gabapentin': {
          name: 'Gabapentin',
          dosage: '300mg',
          frequency: 'Three times daily',
          notes: 'Used for nerve pain and epilepsy.'
        },
        'albuterol': {
          name: 'Albuterol',
          dosage: '2 puffs',
          frequency: 'Every 4-6 hours as needed',
          notes: 'Bronchodilator for asthma and COPD.'
        },
        'fluoxetine': {
          name: 'Fluoxetine',
          dosage: '20mg',
          frequency: 'Once daily',
          notes: 'SSRI antidepressant.'
        },
        'clonazepam': {
          name: 'Clonazepam',
          dosage: '0.5mg',
          frequency: 'Twice daily',
          notes: 'Benzodiazepine used for anxiety and seizures.'
        },
        'aceclofenac': {
          name: 'Aceclofenac',
          dosage: '100mg',
          frequency: 'Twice daily',
          notes: 'NSAID used for pain and inflammation.'
        },
        'domperidone': {
          name: 'Domperidone',
          dosage: '10mg',
          frequency: 'Three times daily',
          notes: 'Anti-nausea medication and promotes gastric emptying.'
        },
        'furosemide': {
          name: 'Furosemide',
          dosage: '40mg',
          frequency: 'Once daily',
          notes: 'Loop diuretic used for fluid retention and high blood pressure.'
        },
        'escitalopram': {
          name: 'Escitalopram',
          dosage: '10mg',
          frequency: 'Once daily',
          notes: 'SSRI antidepressant used for depression and anxiety.'
        },
        'warfarin': {
          name: 'Warfarin',
          dosage: '2-5mg',
          frequency: 'Once daily',
          notes: 'Blood thinner used to prevent clots.'
        },
        'sitagliptin': {
          name: 'Sitagliptin',
          dosage: '100mg',
          frequency: 'Once daily',
          notes: 'Used for type 2 diabetes.'
        },
        'famotidine': {
          name: 'Famotidine',
          dosage: '20mg',
          frequency: 'Twice daily',
          notes: 'H2 blocker used for acid reflux and ulcers.'
        },
        'levofloxacin': {
          name: 'Levofloxacin',
          dosage: '500mg',
          frequency: 'Once daily',
          notes: 'Fluoroquinolone antibiotic for various infections.'
        },
        'loratadine': {
          name: 'Loratadine',
          dosage: '10mg',
          frequency: 'Once daily',
          notes: 'Non-drowsy antihistamine for allergies.'
        },
        'pregabalin': {
          name: 'Pregabalin',
          dosage: '75mg',
          frequency: 'Twice daily',
          notes: 'Used for nerve pain, epilepsy, and anxiety.'
        },
        'ivermectin': {
          name: 'Ivermectin',
          dosage: '12mg',
          frequency: 'Single dose or as directed',
          notes: 'Antiparasitic medication.'
        },
        'doxycycline': {
          name: 'Doxycycline',
          dosage: '100mg',
          frequency: 'Twice daily',
          notes: 'Tetracycline antibiotic for various infections.'
        },
        'hydrochlorothiazide': {
          name: 'Hydrochlorothiazide',
          dosage: '25mg',
          frequency: 'Once daily',
          notes: 'Thiazide diuretic used for high blood pressure.'
        },
        'venlafaxine': {
          name: 'Venlafaxine',
          dosage: '75mg',
          frequency: 'Once daily',
          notes: 'SNRI antidepressant.'
        },
        'mefenamic acid': {
          name: 'Mefenamic Acid',
          dosage: '500mg',
          frequency: 'Three times daily',
          notes: 'NSAID used for pain and menstrual cramps.'
        },
        'norfloxacin': {
          name: 'Norfloxacin',
          dosage: '400mg',
          frequency: 'Twice daily',
          notes: 'Antibiotic primarily used for urinary tract infections.'
        },
        'ofloxacin': {
          name: 'Ofloxacin',
          dosage: '200mg',
          frequency: 'Twice daily',
          notes: 'Fluoroquinolone antibiotic for various infections.'
        },
        'terbinafine': {
          name: 'Terbinafine',
          dosage: '250mg',
          frequency: 'Once daily',
          notes: 'Antifungal medication for fungal infections of skin and nails.'
        },
        'levocetrizine': {
          name: 'Levocetrizine',
          dosage: '5mg',
          frequency: 'Once daily',
          notes: 'Antihistamine used for allergies.'
        },
        'deflazacort': {
          name: 'Deflazacort',
          dosage: '6mg',
          frequency: 'Once daily',
          notes: 'Corticosteroid used for various inflammatory conditions.'
        },
        'telmisartan': {
          name: 'Telmisartan',
          dosage: '40mg',
          frequency: 'Once daily',
          notes: 'ARB used for high blood pressure.'
        },
        'nimesulide': {
          name: 'Nimesulide',
          dosage: '100mg',
          frequency: 'Twice daily',
          notes: 'NSAID used for pain and inflammation.'
        },
        'ondansetron': {
          name: 'Ondansetron',
          dosage: '4mg',
          frequency: 'Every 8 hours as needed',
          notes: 'Anti-nausea medication.'
        },
        'folic acid': {
          name: 'Folic Acid',
          dosage: '5mg',
          frequency: 'Once daily',
          notes: 'Vitamin supplement for folate deficiency and pregnancy.'
        },
        'rosuvastatin': {
          name: 'Rosuvastatin',
          dosage: '10mg',
          frequency: 'Once daily',
          notes: 'Statin medication for high cholesterol.'
        },
        'dolo': {
          name: 'Dolo 650',
          dosage: '650mg',
          frequency: 'Every 6 hours as needed',
          notes: 'Brand name for paracetamol used for pain relief and fever reduction.'
        }
      };
    
    searchForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const query = searchInput.value.toLowerCase().trim();
      
      // Show loading animation
      medicineInfo.style.display = 'block';
      medicineInfo.innerHTML = `
        <div class="loading">
          <div></div>
          <div></div>
          <div></div>
        </div>
      `;
      
      // Simulate API delay
      setTimeout(() => {
        if (query === '') {
          medicineInfo.innerHTML = '<p>Please enter a medicine name.</p>';
          return;
        }
        
        let results = [];
        
        // Search for exact and partial matches
        for (const key in medicines) {
          if (key.includes(query) || medicines[key].name.toLowerCase().includes(query)) {
            results.push(medicines[key]);
          }
        }
        
        if (results.length > 0) 
          {
          let html = '';
          results.forEach(med => 
            {
            html += `
              <div class="med-card">
                <h2>${med.name}</h2>
                <div class="med-detail">
                  <span class="med-label">Dosage:</span>
                  <span class="med-value">${med.dosage}</span>
                </div>
                <div class="med-detail">
                  <span class="med-label">Frequency:</span>
                  <span class="med-value">${med.frequency}</span>
                </div>
                <div class="med-notes">${med.notes}</div>
              </div>
            `;
          });
          medicineInfo.innerHTML = html;
        }
        else 
        {
          medicineInfo.innerHTML = '<p>No medicine found with that name.</p>';
        }
      }, 800);
    });
  });
