#!/usr/bin/env python3
"""
Audiobook Generator using edge-tts (Free Microsoft Edge TTS)
Generates high-quality audiobooks from text with zero cost
"""

import asyncio
import json
import os
import sys
from pathlib import Path
from typing import Dict, List, Optional

try:
    import edge_tts
except ImportError:
    print("Installing edge-tts...")
    os.system(f"{sys.executable} -m pip install edge-tts")
    import edge_tts


class AudiobookGenerator:
    """Generate audiobooks using free Microsoft Edge TTS"""
    
    # High-quality voices for different languages
    VOICES = {
        'en': [
            'en-US-JennyNeural',      # Natural female voice
            'en-US-GuyNeural',        # Natural male voice
            'en-GB-SoniaNeural',      # British female
            'en-GB-RyanNeural',       # British male
        ],
        'es': [
            'es-ES-ElviraNeural',     # Spanish female
            'es-ES-AlvaroNeural',     # Spanish male
            'es-MX-DaliaNeural',      # Mexican female
            'es-MX-JorgeNeural',      # Mexican male
        ]
    }
    
    def __init__(self, output_dir: str = "audiobooks"):
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(exist_ok=True)
        
    def get_voice(self, language: str = 'en', index: int = 0) -> str:
        """Get a voice for the specified language"""
        voices = self.VOICES.get(language, self.VOICES['en'])
        return voices[index % len(voices)]
    
    async def generate_audio(
        self,
        text: str,
        output_file: Path,
        voice: str,
        rate: str = '+0%',
        pitch: str = '+0Hz',
        volume: str = '+0%'
    ) -> bool:
        """Generate audio from text using edge-tts"""
        try:
            communicate = edge_tts.Communicate(
                text,
                voice,
                rate=rate,
                pitch=pitch,
                volume=volume
            )
            
            await communicate.save(str(output_file))
            print(f"✓ Generated: {output_file.name}")
            return True
            
        except Exception as e:
            print(f"✗ Error generating {output_file.name}: {e}")
            return False
    
    async def generate_audiobook(
        self,
        title: str,
        chapters: List[Dict[str, str]],
        language: str = 'en',
        voice_index: int = 0
    ) -> Dict[str, str]:
        """Generate a complete audiobook from chapters"""
        audiobook_dir = self.output_dir / title.replace(' ', '_').lower()
        audiobook_dir.mkdir(exist_ok=True)
        
        voice = self.get_voice(language, voice_index)
        print(f"\n🎧 Generating audiobook: {title}")
        print(f"📝 Language: {language}, Voice: {voice}")
        print(f"📚 Chapters: {len(chapters)}")
        
        metadata = {
            'title': title,
            'language': language,
            'voice': voice,
            'chapters': []
        }
        
        for i, chapter in enumerate(chapters, 1):
            chapter_title = chapter.get('title', f'Chapter {i}')
            chapter_text = chapter.get('text', '')
            
            if not chapter_text:
                print(f"⚠ Skipping empty chapter: {chapter_title}")
                continue
            
            # Generate audio file
            audio_file = audiobook_dir / f"{i:03d}_{chapter_title.replace(' ', '_')}.mp3"
            
            success = await self.generate_audio(
                chapter_text,
                audio_file,
                voice
            )
            
            if success:
                metadata['chapters'].append({
                    'number': i,
                    'title': chapter_title,
                    'file': audio_file.name,
                    'duration': self._get_audio_duration(audio_file)
                })
        
        # Save metadata
        metadata_file = audiobook_dir / 'metadata.json'
        with open(metadata_file, 'w', encoding='utf-8') as f:
            json.dump(metadata, f, indent=2, ensure_ascii=False)
        
        print(f"\n✅ Audiobook complete: {audiobook_dir}")
        print(f"📊 Generated {len(metadata['chapters'])} chapters")
        
        return metadata
    
    def _get_audio_duration(self, audio_file: Path) -> float:
        """Get audio file duration (placeholder - requires pydub)"""
        # For now, estimate based on text length
        # Average speaking rate: ~150 words per minute
        return 0.0  # Would need pydub for accurate duration
    
    async def generate_sample_audiobooks(self) -> None:
        """Generate sample audiobooks for testing"""
        
        # Sample: Messages from the Angels of Prosperity
        angels_chapters = [
            {
                'title': 'Introduction to Angelic Guidance',
                'text': '''Welcome to Messages from the Angels of Prosperity. 
                This audiobook brings you inspirational angel-themed reflections 
                for hope, abundance, courage and renewal. The angels are always 
                with you, guiding you toward prosperity and peace. 
                Open your heart to receive their divine wisdom and let their 
                light illuminate your path to abundance.'''
            },
            {
                'title': 'The Angel of Hope',
                'text': '''The Angel of Hope appears when you need encouragement most. 
                Hope is the light that shines in the darkest moments, 
                reminding you that better days are ahead. When you feel lost, 
                call upon the Angel of Hope to renew your spirit and show you 
                the way forward. Hope is not just a feeling; it is a powerful 
                force that transforms challenges into opportunities.'''
            },
            {
                'title': 'The Angel of Abundance',
                'text': '''The Angel of Abundance teaches that prosperity flows 
                to those who believe in their worth. Abundance is not merely 
                material wealth; it encompasses love, joy, health, and 
                spiritual fulfillment. When you align your thoughts with 
                abundance, you become a magnet for prosperity in all its forms. 
                The universe wants you to thrive.'''
            },
            {
                'title': 'The Angel of Courage',
                'text': '''Courage is not the absence of fear, but the determination 
                to move forward despite it. The Angel of Courage stands beside you 
                when you face difficult decisions or daunting challenges. 
                With angelic guidance, you find strength you never knew you possessed. 
                Courage grows each time you choose to act in spite of your fears.'''
            },
            {
                'title': 'The Angel of Renewal',
                'text': '''Every ending brings a new beginning. The Angel of Renewal 
                helps you release the old and embrace the new. Like the seasons, 
                life moves through cycles of growth, rest, and rebirth. 
                When you trust in the process of renewal, you discover that 
                change is not something to fear, but a gift that leads to transformation.'''
            }
        ]
        
        await self.generate_audiobook(
            'Messages_from_the_Angels_of_Prosperity',
            angels_chapters,
            language='en',
            voice_index=0
        )
        
        # Spanish version
        angels_chapters_es = [
            {
                'title': 'Introducción a la Guía Angélica',
                'text': '''Bienvenido a Mensajes de los Ángeles de la Prosperidad. 
                Este audiolibro te trae reflexiones angélicas inspiradoras 
                para esperanza, abundancia, coraje y renovación. Los ángeles 
                siempre están contigo, guiándote hacia la prosperidad y la paz. 
                Abre tu corazón para recibir su sabiduría divina.'''
            },
            {
                'title': 'El Ángel de la Esperanza',
                'text': '''El Ángel de la Esperanza aparece cuando más necesitas 
                aliento. La esperanza es la luz que brilla en los momentos 
                más oscuros, recordándote que días mejores están por venir. 
                Cuando te sientas perdido, invoca al Ángel de la Esperanza 
                para renovar tu espíritu y mostrarte el camino adelante.'''
            },
            {
                'title': 'El Ángel de la Abundancia',
                'text': '''El Ángel de la Abundancia enseña que la prosperidad 
                fluye hacia quienes creen en su valor. La abundancia no es 
                solo riqueza material; abarca amor, alegría, salud y 
                realización espiritual. Cuando alineas tus pensamientos con 
                la abundancia, te conviertes en un imán para la prosperidad.'''
            },
            {
                'title': 'El Ángel del Coraje',
                'text': '''El coraje no es la ausencia de miedo, sino la determinación 
                de avanzar a pesar de él. El Ángel del Coraje está a tu lado 
                cuando enfrentas decisiones difíciles o desafíos abrumadores. 
                Con la guía angélica, encuentras fuerza que nunca supiste que poseías.'''
            },
            {
                'title': 'El Ángel de la Renovación',
                'text': '''Cada final trae un nuevo comienzo. El Ángel de la Renovación 
                te ayuda a soltar lo viejo y abrazar lo nuevo. Como las estaciones, 
                la vida se mueve a través de ciclos de crecimiento, descanso y renacimiento. 
                Cuando confías en el proceso de renovación, descubres que el cambio 
                no es algo que temer, sino un regalo que conduce a la transformación.'''
            }
        ]
        
        await self.generate_audiobook(
            'Mensajes_de_los_Angeles_de_la_Prosperidad',
            angels_chapters_es,
            language='es',
            voice_index=0
        )
        
        # Sample: Recipe audiobook
        recipe_chapters = [
            {
                'title': 'Welcome to the Sweet Recipes Treasury',
                'text': '''Welcome to The Thousand Sweet Recipes Treasury, 
                your comprehensive guide to creating delicious desserts 
                from around the world. This collection brings together 
                time-tested recipes passed down through generations, 
                along with modern twists that will delight your family and friends. 
                Whether you are a beginner or an experienced baker, 
                you will find inspiration in these pages.'''
            },
            {
                'title': 'Essential Baking Tips',
                'text': '''Before we dive into the recipes, let's cover some 
                essential baking tips that will ensure your success. 
                First, always read the entire recipe before beginning. 
                Measure ingredients accurately using proper measuring cups and spoons. 
                Room temperature ingredients blend better than cold ones. 
                And most importantly, have fun and don't be afraid to experiment!'''
            },
            {
                'title': 'Classic Chocolate Chip Cookies',
                'text': '''Nothing beats the aroma of freshly baked chocolate chip cookies. 
                This classic recipe delivers perfectly crisp edges and chewy centers. 
                Start by creaming butter and sugar until light and fluffy, 
                then add eggs one at a time. Mix in flour, baking soda, and salt, 
                then fold in plenty of chocolate chips. Bake at 375 degrees 
                for 9 to 11 minutes until golden brown. Let cool slightly before enjoying.'''
            }
        ]
        
        await self.generate_audiobook(
            'The_Thousand_Sweet_Recipes_Treasury',
            recipe_chapters,
            language='en',
            voice_index=1
        )


async def main():
    """Main entry point"""
    generator = AudiobookGenerator()
    
    print("🎙️  Audiobook Generator using edge-tts (Free)")
    print("=" * 50)
    
    # Generate sample audiobooks
    await generator.generate_sample_audiobooks()
    
    print("\n✨ All audiobooks generated successfully!")
    print(f"📁 Output directory: {generator.output_dir}")


if __name__ == "__main__":
    asyncio.run(main())
